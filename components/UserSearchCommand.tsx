'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserCircle } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
}

export function UserSearchCommand() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [users, setUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  React.useEffect(() => {
    if (debouncedQuery.length === 0) {
      setUsers([]);
      return;
    }

    const searchUsers = async () => {
      try {
        const response = await fetch(
          `/api/users/search?q=${encodeURIComponent(debouncedQuery)}`
        );
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error searching users:', error);
      }
    };

    searchUsers();
  }, [debouncedQuery]);

  const handleSelect = (userID: string) => {
    setIsOpen(false);
    router.push(`/dashboard/profile/${userID}`);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative h-9 w-full max-w-[400px] rounded-md bg-background px-4 py-2 text-sm text-muted-foreground border border-input hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
      >
        <span>Buscar usuarios...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Buscar usuarios..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No se encontraron usuarios.</CommandEmpty>
          <CommandGroup heading="Usuarios">
            {users.map((user) => (
              <CommandItem
                key={user.id}
                value={`${user.firstName} ${user.lastName}`}
                onSelect={() => handleSelect(user.id)}
                className="flex items-center gap-2"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback>
                    <UserCircle className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    @{user.username}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
