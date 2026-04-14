export type Driver = {
  id: string
  name: string
  phone: string | null
  license_number: string | null
  status: 'available' | 'busy' | string
}

export type LoadStatus = 'pending' | 'assigned' | 'in_transit' | 'delivered' | string

export type Load = {
  id: string
  pickup_location: string
  dropoff_location: string
  weight: number | null
  status: LoadStatus
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

export type LoadRequest = {
  id: string
  user_id: string
  pickup_location: string
  dropoff_location: string
  weight: number | null
  notes: string | null
  status: 'pending' | 'approved' | 'rejected' | string
  load_id: string | null
  reviewed_at: string | null
  created_at: string
}

export type DashboardStats = {
  totalDrivers: number
  activeLoads: number
  completedDeliveries: number
  pendingRequests: number
}
