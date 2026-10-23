import { Train } from '../types';

export const INDIAN_TRAINS: Train[] = [
  {
    trainNumber: '12952',
    trainName: 'Mumbai Tejas Rajdhani Express',
    trainType: 'RAJDHANI',
    originStationCode: 'NDLS',
    originStationName: 'New Delhi',
    destinationStationCode: 'MMCT',
    destinationStationName: 'Mumbai Central',
    departureTime: '16:55',
    arrivalTime: '08:35',
    durationHours: '15h 40m',
    runningDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    classes: ['1A', '2A', '3A'],
    availabilities: {
      '3A': {
        className: '3A',
        fare: 2450,
        tatkalFare: 2850,
        availableSeats: 0,
        totalSeats: 360,
        status: 'WL',
        statusDetail: 'WL-14',
        tatkalSeats: 32,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-32'
      },
      '2A': {
        className: '2A',
        fare: 3590,
        tatkalFare: 4090,
        availableSeats: 6,
        totalSeats: 120,
        status: 'AVAILABLE',
        statusDetail: 'AVAILABLE-6',
        tatkalSeats: 12,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-12'
      },
      '1A': {
        className: '1A',
        fare: 5410,
        tatkalFare: 5910,
        availableSeats: 2,
        totalSeats: 36,
        status: 'RAC',
        statusDetail: 'RAC-2',
        tatkalSeats: 4,
        tatkalStatus: 'RAC',
        tatkalStatusDetail: 'RAC-4'
      }
    },
    stops: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '16:55', departureTime: '16:55', dayCount: 1, distanceKm: 0 },
      { stationCode: 'KOTA', stationName: 'Kota Junction', arrivalTime: '21:30', departureTime: '21:40', dayCount: 1, distanceKm: 465 },
      { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '03:40', departureTime: '03:50', dayCount: 2, distanceKm: 992 },
      { stationCode: 'ST', stationName: 'Surat', arrivalTime: '05:13', departureTime: '05:18', dayCount: 2, distanceKm: 1122 },
      { stationCode: 'MMCT', stationName: 'Mumbai Central', arrivalTime: '08:35', departureTime: '08:35', dayCount: 2, distanceKm: 1384 }
    ]
  },
  {
    trainNumber: '12951',
    trainName: 'Mumbai Tejas Rajdhani Express (Up)',
    trainType: 'RAJDHANI',
    originStationCode: 'MMCT',
    originStationName: 'Mumbai Central',
    destinationStationCode: 'NDLS',
    destinationStationName: 'New Delhi',
    departureTime: '17:00',
    arrivalTime: '08:32',
    durationHours: '15h 32m',
    runningDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    classes: ['1A', '2A', '3A'],
    availabilities: {
      '3A': {
        className: '3A',
        fare: 2450,
        tatkalFare: 2850,
        availableSeats: 0,
        totalSeats: 360,
        status: 'WL',
        statusDetail: 'WL-38',
        tatkalSeats: 28,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-28'
      },
      '2A': {
        className: '2A',
        fare: 3590,
        tatkalFare: 4090,
        availableSeats: 4,
        totalSeats: 120,
        status: 'AVAILABLE',
        statusDetail: 'AVAILABLE-4',
        tatkalSeats: 10,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-10'
      },
      '1A': {
        className: '1A',
        fare: 5410,
        tatkalFare: 5910,
        availableSeats: 0,
        totalSeats: 36,
        status: 'WL',
        statusDetail: 'WL-3',
        tatkalSeats: 2,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-2'
      }
    },
    stops: [
      { stationCode: 'MMCT', stationName: 'Mumbai Central', arrivalTime: '17:00', departureTime: '17:00', dayCount: 1, distanceKm: 0 },
      { stationCode: 'ST', stationName: 'Surat', arrivalTime: '19:43', departureTime: '19:48', dayCount: 1, distanceKm: 263 },
      { stationCode: 'BRC', stationName: 'Vadodara Junction', arrivalTime: '21:06', departureTime: '21:16', dayCount: 1, distanceKm: 392 },
      { stationCode: 'KOTA', stationName: 'Kota Junction', arrivalTime: '03:15', departureTime: '03:20', dayCount: 2, distanceKm: 919 },
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '08:32', departureTime: '08:32', dayCount: 2, distanceKm: 1384 }
    ]
  },
  {
    trainNumber: '22436',
    trainName: 'Vande Bharat Express',
    trainType: 'VANDE_BHARAT',
    originStationCode: 'NDLS',
    originStationName: 'New Delhi',
    destinationStationCode: 'BSB',
    destinationStationName: 'Varanasi Junction',
    departureTime: '06:00',
    arrivalTime: '14:00',
    durationHours: '8h 00m',
    runningDays: ['TUE', 'WED', 'FRI', 'SAT', 'SUN'],
    classes: ['CC', 'EC'],
    availabilities: {
      'CC': {
        className: 'CC',
        fare: 1750,
        tatkalFare: 2050,
        availableSeats: 48,
        totalSeats: 900,
        status: 'AVAILABLE',
        statusDetail: 'AVAILABLE-48',
        tatkalSeats: 75,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-75'
      },
      'EC': {
        className: 'EC',
        fare: 3300,
        tatkalFare: 3750,
        availableSeats: 8,
        totalSeats: 104,
        status: 'AVAILABLE',
        statusDetail: 'AVAILABLE-8',
        tatkalSeats: 12,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-12'
      }
    },
    stops: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '06:00', departureTime: '06:00', dayCount: 1, distanceKm: 0 },
      { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '10:08', departureTime: '10:10', dayCount: 1, distanceKm: 440 },
      { stationCode: 'PRYJ', stationName: 'Prayagraj Junction', arrivalTime: '12:08', departureTime: '12:10', dayCount: 1, distanceKm: 635 },
      { stationCode: 'BSB', stationName: 'Varanasi Junction', arrivalTime: '14:00', departureTime: '14:00', dayCount: 1, distanceKm: 759 }
    ]
  },
  {
    trainNumber: '12302',
    trainName: 'Howrah Rajdhani Express (via Gaya)',
    trainType: 'RAJDHANI',
    originStationCode: 'NDLS',
    originStationName: 'New Delhi',
    destinationStationCode: 'HWH',
    destinationStationName: 'Howrah Junction',
    departureTime: '16:50',
    arrivalTime: '09:55',
    durationHours: '17h 05m',
    runningDays: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'SAT'],
    classes: ['1A', '2A', '3A'],
    availabilities: {
      '3A': {
        className: '3A',
        fare: 2510,
        tatkalFare: 2910,
        availableSeats: 0,
        totalSeats: 420,
        status: 'WL',
        statusDetail: 'WL-46',
        tatkalSeats: 40,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-40'
      },
      '2A': {
        className: '2A',
        fare: 3650,
        tatkalFare: 4150,
        availableSeats: 0,
        totalSeats: 140,
        status: 'RAC',
        statusDetail: 'RAC-5',
        tatkalSeats: 14,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-14'
      },
      '1A': {
        className: '1A',
        fare: 5540,
        tatkalFare: 6040,
        availableSeats: 4,
        totalSeats: 36,
        status: 'AVAILABLE',
        statusDetail: 'AVAILABLE-4',
        tatkalSeats: 4,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-4'
      }
    },
    stops: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '16:50', departureTime: '16:50', dayCount: 1, distanceKm: 0 },
      { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '21:32', departureTime: '21:37', dayCount: 1, distanceKm: 440 },
      { stationCode: 'PRYJ', stationName: 'Prayagraj Junction', arrivalTime: '23:43', departureTime: '23:45', dayCount: 1, distanceKm: 635 },
      { stationCode: 'GAYA', stationName: 'Gaya Junction', arrivalTime: '03:58', departureTime: '04:01', dayCount: 2, distanceKm: 994 },
      { stationCode: 'HWH', stationName: 'Howrah Junction', arrivalTime: '09:55', departureTime: '09:55', dayCount: 2, distanceKm: 1451 }
    ]
  },
  {
    trainNumber: '12626',
    trainName: 'Kerala Superfast Express',
    trainType: 'SUPERFAST',
    originStationCode: 'NDLS',
    originStationName: 'New Delhi',
    destinationStationCode: 'TVC',
    destinationStationName: 'Thiruvananthapuram Central',
    departureTime: '20:10',
    arrivalTime: '18:00',
    durationHours: '45h 50m',
    runningDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    classes: ['2A', '3A', '3E', 'SL'],
    availabilities: {
      'SL': {
        className: 'SL',
        fare: 890,
        tatkalFare: 1090,
        availableSeats: 0,
        totalSeats: 640,
        status: 'WL',
        statusDetail: 'WL-120',
        tatkalSeats: 96,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-96'
      },
      '3E': {
        className: '3E',
        fare: 2150,
        tatkalFare: 2470,
        availableSeats: 0,
        totalSeats: 216,
        status: 'WL',
        statusDetail: 'WL-35',
        tatkalSeats: 24,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-24'
      },
      '3A': {
        className: '3A',
        fare: 2340,
        tatkalFare: 2740,
        availableSeats: 0,
        totalSeats: 384,
        status: 'WL',
        statusDetail: 'WL-42',
        tatkalSeats: 48,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-48'
      },
      '2A': {
        className: '2A',
        fare: 3410,
        tatkalFare: 3910,
        availableSeats: 3,
        totalSeats: 96,
        status: 'AVAILABLE',
        statusDetail: 'AVAILABLE-3',
        tatkalSeats: 12,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-12'
      }
    },
    stops: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '20:10', departureTime: '20:10', dayCount: 1, distanceKm: 0 },
      { stationCode: 'GWL', stationName: 'Gwalior Junction', arrivalTime: '00:03', departureTime: '00:05', dayCount: 2, distanceKm: 313 },
      { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '05:20', departureTime: '05:25', dayCount: 2, distanceKm: 705 },
      { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '11:45', departureTime: '11:50', dayCount: 2, distanceKm: 1095 },
      { stationCode: 'CBE', stationName: 'Coimbatore Junction', arrivalTime: '07:12', departureTime: '07:15', dayCount: 3, distanceKm: 2525 },
      { stationCode: 'ERS', stationName: 'Ernakulam Junction', arrivalTime: '10:30', departureTime: '10:35', dayCount: 3, distanceKm: 2755 },
      { stationCode: 'TVC', stationName: 'Thiruvananthapuram Central', arrivalTime: '18:00', departureTime: '18:00', dayCount: 3, distanceKm: 3036 }
    ]
  },
  {
    trainNumber: '12002',
    trainName: 'Bhopal Shatabdi Express',
    trainType: 'SHATABDI',
    originStationCode: 'NDLS',
    originStationName: 'New Delhi',
    destinationStationCode: 'RKMP',
    destinationStationName: 'Rani Kamalapati (Bhopal)',
    departureTime: '06:00',
    arrivalTime: '14:40',
    durationHours: '8h 40m',
    runningDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    classes: ['CC', 'EC'],
    availabilities: {
      'CC': {
        className: 'CC',
        fare: 1540,
        tatkalFare: 1840,
        availableSeats: 112,
        totalSeats: 640,
        status: 'AVAILABLE',
        statusDetail: 'AVAILABLE-112',
        tatkalSeats: 60,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-60'
      },
      'EC': {
        className: 'EC',
        fare: 2760,
        tatkalFare: 3210,
        availableSeats: 14,
        totalSeats: 92,
        status: 'AVAILABLE',
        statusDetail: 'AVAILABLE-14',
        tatkalSeats: 10,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-10'
      }
    },
    stops: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '06:00', departureTime: '06:00', dayCount: 1, distanceKm: 0 },
      { stationCode: 'GWL', stationName: 'Gwalior Junction', arrivalTime: '09:23', departureTime: '09:28', dayCount: 1, distanceKm: 313 },
      { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '14:12', departureTime: '14:15', dayCount: 1, distanceKm: 705 },
      { stationCode: 'RKMP', stationName: 'Rani Kamalapati', arrivalTime: '14:40', departureTime: '14:40', dayCount: 1, distanceKm: 711 }
    ]
  },
  {
    trainNumber: '12622',
    trainName: 'Tamil Nadu Superfast Express',
    trainType: 'SUPERFAST',
    originStationCode: 'NDLS',
    originStationName: 'New Delhi',
    destinationStationCode: 'MAS',
    destinationStationName: 'Chennai Central',
    departureTime: '21:05',
    arrivalTime: '06:35',
    durationHours: '33h 30m',
    runningDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    classes: ['1A', '2A', '3A', 'SL'],
    availabilities: {
      'SL': {
        className: 'SL',
        fare: 820,
        tatkalFare: 1020,
        availableSeats: 0,
        totalSeats: 600,
        status: 'WL',
        statusDetail: 'WL-85',
        tatkalSeats: 80,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-80'
      },
      '3A': {
        className: '3A',
        fare: 2180,
        tatkalFare: 2580,
        availableSeats: 0,
        totalSeats: 360,
        status: 'WL',
        statusDetail: 'WL-24',
        tatkalSeats: 36,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-36'
      },
      '2A': {
        className: '2A',
        fare: 3190,
        tatkalFare: 3690,
        availableSeats: 8,
        totalSeats: 96,
        status: 'AVAILABLE',
        statusDetail: 'AVAILABLE-8',
        tatkalSeats: 12,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-12'
      },
      '1A': {
        className: '1A',
        fare: 5350,
        tatkalFare: 5850,
        availableSeats: 2,
        totalSeats: 24,
        status: 'AVAILABLE',
        statusDetail: 'AVAILABLE-2',
        tatkalSeats: 2,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-2'
      }
    },
    stops: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '21:05', departureTime: '21:05', dayCount: 1, distanceKm: 0 },
      { stationCode: 'GWL', stationName: 'Gwalior Junction', arrivalTime: '01:13', departureTime: '01:15', dayCount: 2, distanceKm: 313 },
      { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '06:45', departureTime: '06:50', dayCount: 2, distanceKm: 705 },
      { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '13:05', departureTime: '13:10', dayCount: 2, distanceKm: 1095 },
      { stationCode: 'MAS', stationName: 'Chennai Central', arrivalTime: '06:35', departureTime: '06:35', dayCount: 3, distanceKm: 2182 }
    ]
  },
  {
    trainNumber: '12627',
    trainName: 'Karnataka Superfast Express',
    trainType: 'SUPERFAST',
    originStationCode: 'SBC',
    originStationName: 'KSR Bengaluru',
    destinationStationCode: 'NDLS',
    destinationStationName: 'New Delhi',
    departureTime: '19:20',
    arrivalTime: '09:00',
    durationHours: '37h 40m',
    runningDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    classes: ['1A', '2A', '3A', 'SL'],
    availabilities: {
      'SL': {
        className: 'SL',
        fare: 860,
        tatkalFare: 1060,
        availableSeats: 0,
        totalSeats: 580,
        status: 'WL',
        statusDetail: 'WL-92',
        tatkalSeats: 80,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-80'
      },
      '3A': {
        className: '3A',
        fare: 2280,
        tatkalFare: 2680,
        availableSeats: 0,
        totalSeats: 340,
        status: 'WL',
        statusDetail: 'WL-31',
        tatkalSeats: 36,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-36'
      },
      '2A': {
        className: '2A',
        fare: 3340,
        tatkalFare: 3840,
        availableSeats: 5,
        totalSeats: 96,
        status: 'AVAILABLE',
        statusDetail: 'AVAILABLE-5',
        tatkalSeats: 12,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-12'
      },
      '1A': {
        className: '1A',
        fare: 5580,
        tatkalFare: 6080,
        availableSeats: 1,
        totalSeats: 24,
        status: 'AVAILABLE',
        statusDetail: 'AVAILABLE-1',
        tatkalSeats: 2,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-2'
      }
    },
    stops: [
      { stationCode: 'SBC', stationName: 'KSR Bengaluru', arrivalTime: '19:20', departureTime: '19:20', dayCount: 1, distanceKm: 0 },
      { stationCode: 'SC', stationName: 'Secunderabad Junction', arrivalTime: '07:35', departureTime: '07:45', dayCount: 2, distanceKm: 624 },
      { stationCode: 'NGP', stationName: 'Nagpur Junction', arrivalTime: '16:45', departureTime: '16:50', dayCount: 2, distanceKm: 1205 },
      { stationCode: 'BPL', stationName: 'Bhopal Junction', arrivalTime: '23:30', departureTime: '23:35', dayCount: 2, distanceKm: 1595 },
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '09:00', departureTime: '09:00', dayCount: 3, distanceKm: 2400 }
    ]
  },
  {
    trainNumber: '12394',
    trainName: 'Sampoorna Kranti Superfast Express',
    trainType: 'SUPERFAST',
    originStationCode: 'NDLS',
    originStationName: 'New Delhi',
    destinationStationCode: 'PNBE',
    destinationStationName: 'Patna Junction',
    departureTime: '17:30',
    arrivalTime: '06:50',
    durationHours: '13h 20m',
    runningDays: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    classes: ['1A', '2A', '3A', '3E', 'SL'],
    availabilities: {
      'SL': {
        className: 'SL',
        fare: 510,
        tatkalFare: 650,
        availableSeats: 0,
        totalSeats: 600,
        status: 'WL',
        statusDetail: 'WL-145',
        tatkalSeats: 90,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-90'
      },
      '3A': {
        className: '3A',
        fare: 1380,
        tatkalFare: 1680,
        availableSeats: 0,
        totalSeats: 380,
        status: 'WL',
        statusDetail: 'WL-62',
        tatkalSeats: 48,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-48'
      },
      '2A': {
        className: '2A',
        fare: 1980,
        tatkalFare: 2380,
        availableSeats: 0,
        totalSeats: 96,
        status: 'WL',
        statusDetail: 'WL-18',
        tatkalSeats: 12,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-12'
      },
      '1A': {
        className: '1A',
        fare: 3340,
        tatkalFare: 3840,
        availableSeats: 2,
        totalSeats: 24,
        status: 'AVAILABLE',
        statusDetail: 'AVAILABLE-2',
        tatkalSeats: 2,
        tatkalStatus: 'AVAILABLE',
        tatkalStatusDetail: 'AVAILABLE-2'
      }
    },
    stops: [
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '17:30', departureTime: '17:30', dayCount: 1, distanceKm: 0 },
      { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '22:22', departureTime: '22:30', dayCount: 1, distanceKm: 440 },
      { stationCode: 'DNR', stationName: 'Danapur', arrivalTime: '06:15', departureTime: '06:20', dayCount: 2, distanceKm: 991 },
      { stationCode: 'PNBE', stationName: 'Patna Junction', arrivalTime: '06:50', departureTime: '06:50', dayCount: 2, distanceKm: 1001 }
    ]
  }
];
