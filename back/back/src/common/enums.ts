import { registerEnumType } from '@nestjs/graphql';
import { DisputeStatus } from 'src/dispute/entities/dispute.entity';


registerEnumType(DisputeStatus, {
  name: 'DisputeStatus', 
  description: 'The status of a dispute',
});
