import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { Paperclip } from "lucide-react";
import { mediaExtensions, videoExtensions } from "../../constants/mediaExtensions";

type PQRCardAttachmentsProps = {
  attachments: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  videoRefsDesktop?: React.RefObject<(HTMLVideoElement | null)[]>;
  videoRefsMobile?: React.RefObject<(HTMLVideoElement | null)[]>;
  isMobile?: boolean;
};

export function PQRCardAttachments({
  attachments,
  videoRefsDesktop,
  videoRefsMobile,
  isMobile = false,
}: PQRCardAttachmentsProps) {

  const imageAttachments = attachments.filter((att) =>
    mediaExtensions.includes(att.type.toLowerCase())
  );
  const otherAttachments = attachments.filter(
    (att) => !mediaExtensions.includes(att.type.toLowerCase())
  );

  return (
    <>
      {imageAttachments.length > 0 && (
        <Carousel className="w-full max-w-md mx-auto relative">
          <CarouselContent>
            {imageAttachments.map((attachment, index) => (
              <CarouselItem key={attachment.url}>
                <div className="p-1">
                  {videoExtensions.includes(attachment.type.toLowerCase()) ? (
                    <div className="relative cursor-pointer group h-48 md:h-60">
                      <video
                        ref={(el) => {
                          if (isMobile) {
                            videoRefsMobile!.current[index] = el;
                          } else {
                            videoRefsDesktop!.current[index] = el;
                          }
                        }}
                        src={attachment.url}
                        className="object-cover w-full h-full"
                        controls
                        autoPlay
                        muted
                      />
                    </div>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="relative cursor-pointer group h-60">
                          <Image
                            src={attachment.url}
                            alt={attachment.name}
                            fill
                            className="object-contain border border-gray-200 rounded-md"
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogTitle></DialogTitle>
                        <div className="relative h-[80vh]">
                          <Image
                            src={attachment.url}
                            alt={attachment.name}
                            fill
                            className="object-contain border border-gray-200 rounded-md"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {imageAttachments.length > 1 && (
            <div className="hidden md:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          )}
        </Carousel>
      )}

      {otherAttachments.length > 0 && (
        <div>
          <p className="text-xs my-2">Archivos adjuntos</p>
          <div className="flex flex-wrap gap-2">
            {otherAttachments.map((attachment) => (
              <a
                key={attachment.url}
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md border border-gray-100"
              >
                <Paperclip className="w-4 h-4 no-hover" />
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}