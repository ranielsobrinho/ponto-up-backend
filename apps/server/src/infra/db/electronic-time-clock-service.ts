import { createDb } from "@ponto-up-backend/db";
import * as schema from "@ponto-up-backend/db/schema/electronic-time-clock";
import { and, eq, gte, lte } from "drizzle-orm";
import type { ElectronicTimeClockProtocol } from "@/data/protocols/db/electronic-time-clock-protocol";
import type {
	CreateElectronicTimeClockParams,
	ElectronicTimeClockModel,
	UpdateElectronicTimeClockParams,
} from "@/domain/models/electronic-time-clock";

export class ElectronicTimeClockService implements ElectronicTimeClockProtocol {
	private db = createDb();

	async create(
		params: CreateElectronicTimeClockParams,
	): Promise<ElectronicTimeClockModel> {
		const [result] = await this.db
			.insert(schema.electronicTimeClock)
			.values({
				title: params.title,
				clockIn: params.clockIn,
				clockOut: params.clockOut,
				observations: params.observations ?? null,
				createdBy: params.createdBy,
			})
			.returning();

		if (!result) {
			throw new Error("Failed to create electronic time clock entry");
		}

		return result;
	}

	async list(params?: {
		dateBegin?: Date;
		dateEnd?: Date;
	}): Promise<ElectronicTimeClockModel[]> {
		const conditions = [];

		if (params?.dateBegin) {
			conditions.push(
				gte(schema.electronicTimeClock.createdAt, params.dateBegin),
			);
		}

		if (params?.dateEnd) {
			conditions.push(
				lte(schema.electronicTimeClock.createdAt, params.dateEnd),
			);
		}

		if (conditions.length > 0) {
			return this.db
				.select()
				.from(schema.electronicTimeClock)
				.where(and(...conditions));
		}

		return this.db.select().from(schema.electronicTimeClock);
	}

	async getById(id: number): Promise<ElectronicTimeClockModel | null> {
		const [result] = await this.db
			.select()
			.from(schema.electronicTimeClock)
			.where(eq(schema.electronicTimeClock.id, id))
			.limit(1);

		return result ?? null;
	}

	async getByCreator(creatorId: string): Promise<ElectronicTimeClockModel[]> {
		return this.db
			.select()
			.from(schema.electronicTimeClock)
			.where(eq(schema.electronicTimeClock.createdBy, creatorId));
	}

	async update(
		id: number,
		params: UpdateElectronicTimeClockParams,
	): Promise<ElectronicTimeClockModel> {
		const [result] = await this.db
			.update(schema.electronicTimeClock)
			.set({
				...params,
				observations: params.observations ?? undefined,
			})
			.where(eq(schema.electronicTimeClock.id, id))
			.returning();

		if (!result) {
			throw new Error("Failed to update electronic time clock entry");
		}

		return result;
	}
}
