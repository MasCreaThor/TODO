// src/services/index.ts
import { hotelService, HotelFilterOptions } from './hotel';
import { roomService, RoomFilterOptions } from './room';
import { bookingService, CreateBookingInput } from './booking';
import { categoryService } from './category';

export {
  hotelService,
  HotelFilterOptions,
  roomService,
  RoomFilterOptions,
  bookingService,
  CreateBookingInput,
  categoryService
};