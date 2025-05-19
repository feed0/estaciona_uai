/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.1.1185 on 2025-05-17 20:00:59.

export interface Parking {
    id: string;
    name: string;
    address: string;
    manager: Manager;
    parkingSpaces: ParkingSpace[];
    openAt: DateAsString;
    closeAt: DateAsString;
    documentation: string;
}

export interface ParkingSpace {
    id: string;
    parking: Parking;
    status: ParkingSpaceStatus;
    identifier: string;
}

export interface Reservation {
    id: string;
    customer: Customer;
    parkingSpace: ParkingSpace;
    status: ReservationStatus;
    createdAt: DateAsString;
    updatedAt: DateAsString;
    startAt: DateAsString;
    endAt: DateAsString;
}

export interface Admin extends BaseUser {
    manager: Manager;
}

export interface BaseUser {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface Customer extends BaseUser {
    reservations: Reservation[];
}

export interface Manager extends BaseUser {
    parking: Parking;
    admins: Admin[];
}

export type DateAsString = string;

export const enum ParkingSpaceStatus {
    RESERVED = "RESERVED",
    FREE = "FREE",
}

export const enum ReservationStatus {
    CONFIRMED = "CONFIRMED",
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export const enum UserType {
    MANAGER = "MANAGER",
    ADMIN = "ADMIN",
    CUSTOMER = "CUSTOMER",
}
