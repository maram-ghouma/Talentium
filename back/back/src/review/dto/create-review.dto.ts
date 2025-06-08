export class CreateReviewDto {
    stars: number;
    comment?: string;
    reviewerId: number;
    reviewedUserId: number;
    missionId: number;
    type: 'client' | 'freelancer';
}
