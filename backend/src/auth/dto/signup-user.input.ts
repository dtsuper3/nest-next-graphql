import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SignupUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
