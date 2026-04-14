export type Driver = {
  id: string
  name: string
  phone: string | null
  license_number: string | null
  status: 'available' | 'busy' | string
}

export type Load = {
  id: string
  pickup_location: string
  dropoff_location: string
  weight: number | null
  status: 'pending' | 'assigned' | 'delivered' | string
  user_id: string | null
}

export type Assignment = {
  id: string
  driver_id: string
  load_id: string
  status: string
  drivers?: Driver | null
  loads?: Load | null
}

export type Quote = {
  id: string
  load_id: string
  price: number
  distance: number
}
