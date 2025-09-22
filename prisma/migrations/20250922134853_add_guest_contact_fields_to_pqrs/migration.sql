-- Add new guest contact fields to PQRS table
ALTER TABLE "PQRS" 
ADD COLUMN "guestName" TEXT,
ADD COLUMN "guestEmail" TEXT,
ADD COLUMN "guestPhone" TEXT;