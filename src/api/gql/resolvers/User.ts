import { Resolver, Query, Ctx, ObjectType, Field, ID, Int, ResolverInterface, FieldResolver, Root, Arg } from 'type-graphql';
import { Context } from '../../';
import { OAuthGuild } from './Guild';
import fetch from 'node-fetch';

export interface User {
	id: string;
	username: string;
	discriminator: string;
	avatar: string | null;
	bot: boolean | null;
	locale: string | null;
	verified: string | null;
	email: string | null;
	flags: number | null;
	premium_type: number | null;
	guilds: OAuthGuild[];
}

@ObjectType()
export class User implements User {
	@Field(() => ID)
	public id!: string;

	@Field()
	public username!: string;

	@Field()
	public discriminator!: string;

	@Field(() => String, { nullable: true })
	public avatar!: string | null;

	@Field(() => Boolean, { nullable: true })
	public bot!: boolean | null;

	@Field(() => String, { nullable: true })
	public locale!: string | null;

	@Field(() => String, { nullable: true })
	public verified!: string | null;

	@Field(() => String, { nullable: true })
	public email!: string | null;

	@Field(() => Int, { nullable: true })
	public flags!: number | null;

	@Field(() => Int, { nullable: true })
	public premium_type!: number | null;

	@Field(() => [OAuthGuild])
	public guilds!: OAuthGuild[];
}

@Resolver(() => User)
export class UserResolver implements ResolverInterface<User> {
	@Query(() => User, { nullable: true })
	public me(
		@Ctx() context: Context
	): User | undefined {
		if (!context.req.user) {
			return undefined;
		}
		return context.req.user;
	}

	@FieldResolver()
	public async guilds(
		@Root() _: User,
		@Ctx() context: Context,
		@Arg('id', { nullable: true }) id?: string
	): Promise<OAuthGuild[]> {
		const guilds = await (await fetch('https://discordapp.com/api/users/@me/guilds', {
			headers: {
				authorization: `Bearer ${context.req.token}`
			}
		})).json() as OAuthGuild[];
		if (id) {
			return guilds.filter(guild => guild.id === id);
		}

		return guilds;
	}
}
