export { PrismaClient } from "@prisma/client";
export * from "@prisma/client";

// Core constants for Ghana JHS Educational Stages
export const GHANA_JHS_STAGES = ["JHS_1", "JHS_2", "JHS_3", "COMPLETED_JHS"] as const;
export type GhanaJhsStage = typeof GHANA_JHS_STAGES[number];

// Ghanaian Regions Enum / List
export const GHANA_REGIONS = [
  "GREATER_ACCRA",
  "ASHANTI",
  "WESTERN",
  "WESTERN_NORTH",
  "CENTRAL",
  "EASTERN",
  "VOLTA",
  "OTI",
  "NORTHERN",
  "SAVANNAH",
  "NORTH_EAST",
  "UPPER_EAST",
  "UPPER_WEST",
  "BONO",
  "BONO_EAST",
  "AHAFO"
] as const;
export type GhanaRegion = typeof GHANA_REGIONS[number];
