"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/dal";

export type AddressDTO = {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
};

export type AddressActionState = {
  success: boolean;
  message?: string;
};

function toDTO(address: {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}): AddressDTO {
  return {
    id: address.id,
    name: address.name,
    phone: address.phone,
    street: address.street,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
    country: address.country,
    isDefault: address.isDefault,
  };
}

export async function getAddressesAction(): Promise<AddressDTO[]> {
  const user = await requireUser();
  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
  return addresses.map(toDTO);
}

export async function saveAddressAction(input: {
  id?: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}): Promise<AddressActionState> {
  const user = await requireUser();

  const name = input.name.trim().slice(0, 80);
  const phone = input.phone.trim().slice(0, 20);
  const street = input.street.trim().slice(0, 200);
  const city = input.city.trim().slice(0, 80);
  const state = input.state.trim().slice(0, 80);
  const pincode = input.pincode.trim().slice(0, 10);
  const country = input.country.trim().slice(0, 80) || "India";

  if (!name || !phone || !street || !city || !state || !pincode) {
    return { success: false, message: "Please fill in all the address fields." };
  }
  if (!/^[0-9]{4,10}$/.test(pincode)) {
    return { success: false, message: "Please enter a valid PIN code." };
  }

  try {
    if (input.id) {
      const owned = await prisma.address.count({
        where: { id: input.id, userId: user.id },
      });
      if (owned === 0) {
        return { success: false, message: "Address not found." };
      }
      await prisma.address.update({
        where: { id: input.id },
        data: { name, phone, street, city, state, pincode, country },
      });
    } else {
      const count = await prisma.address.count({ where: { userId: user.id } });
      await prisma.address.create({
        data: {
          userId: user.id,
          name,
          phone,
          street,
          city,
          state,
          pincode,
          country,
          isDefault: count === 0,
        },
      });
    }
  } catch {
    return {
      success: false,
      message: "We couldn't save the address. Please try again.",
    };
  }

  return { success: true, message: "Address saved." };
}

export async function deleteAddressAction(id: string): Promise<AddressActionState> {
  const user = await requireUser();
  const address = await prisma.address.findFirst({
    where: { id, userId: user.id },
  });
  if (!address) {
    return { success: false, message: "Address not found." };
  }

  try {
    await prisma.address.delete({ where: { id } });
    // If we just removed the default address, promote the newest one.
    if (address.isDefault) {
      const next = await prisma.address.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
      if (next) {
        await prisma.address.update({
          where: { id: next.id },
          data: { isDefault: true },
        });
      }
    }
  } catch {
    return {
      success: false,
      message: "We couldn't delete the address. Please try again.",
    };
  }

  return { success: true, message: "Address deleted." };
}

export async function setDefaultAddressAction(
  id: string,
): Promise<AddressActionState> {
  const user = await requireUser();
  const address = await prisma.address.findFirst({
    where: { id, userId: user.id },
  });
  if (!address) {
    return { success: false, message: "Address not found." };
  }

  try {
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id },
        data: { isDefault: true },
      }),
    ]);
  } catch {
    return {
      success: false,
      message: "We couldn't update the address. Please try again.",
    };
  }

  return { success: true, message: "Default address updated." };
}