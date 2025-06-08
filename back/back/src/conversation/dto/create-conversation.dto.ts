export class CreateConversationDto {
  missionId: number;
  participantIds: number[]; // IDs of the client and the selected freelancer
}