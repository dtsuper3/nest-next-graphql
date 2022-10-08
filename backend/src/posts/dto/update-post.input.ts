import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdatePostInput {
  @Field(() => Int)
  id: number;

  @Field()
  body: string;
}
