import { Station } from '../types';

export const INDIAN_STATIONS: Station[] = [
  // Delhi Hubs
  { code: 'NDLS', name: 'New Delhi', city: 'Delhi', state: 'Delhi', zone: 'NR', isJunction: true },
  { code: 'DLI', name: 'Old Delhi', city: 'Delhi', state: 'Delhi', zone: 'NR', isJunction: true },
  { code: 'NZM', name: 'Hazrat Nizamuddin', city: 'Delhi', state: 'Delhi', zone: 'NR', isJunction: true },
  { code: 'ANVT', name: 'Anand Vihar Terminal', city: 'Delhi', state: 'Delhi', zone: 'NR' },
  { code: 'DEC', name: 'Delhi Cantt', city: 'Delhi', state: 'Delhi', zone: 'NR' },

  // Mumbai Hubs
  { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', state: 'Maharashtra', zone: 'CR', isJunction: true },
  { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', zone: 'WR', isJunction: true },
  { code: 'BDTS', name: 'Bandra Terminus', city: 'Mumbai', state: 'Maharashtra', zone: 'WR' },
  { code: 'LTT', name: 'Lokmanya Tilak Terminus', city: 'Mumbai', state: 'Maharashtra', zone: 'CR' },
  { code: 'KYN', name: 'Kalyan Junction', city: 'Kalyan', state: 'Maharashtra', zone: 'CR', isJunction: true },
  { code: 'PUNE', name: 'Pune Junction', city: 'Pune', state: 'Maharashtra', zone: 'CR', isJunction: true },
  { code: 'NGP', name: 'Nagpur Junction', city: 'Nagpur', state: 'Maharashtra', zone: 'CR', isJunction: true },

  // Kolkata Hubs
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal', zone: 'ER', isJunction: true },
  { code: 'SDAH', name: 'Sealdah', city: 'Kolkata', state: 'West Bengal', zone: 'ER', isJunction: true },
  { code: 'KOAA', name: 'Kolkata Chitpur', city: 'Kolkata', state: 'West Bengal', zone: 'ER' },
  { code: 'SHM', name: 'Shalimar', city: 'Howrah', state: 'West Bengal', zone: 'SER' },
  { code: 'KGP', name: 'Kharagpur Junction', city: 'Kharagpur', state: 'West Bengal', zone: 'SER', isJunction: true },

  // Southern Hubs
  { code: 'MAS', name: 'Chennai Central (MGR)', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR', isJunction: true },
  { code: 'MS', name: 'Chennai Egmore', city: 'Chennai', state: 'Tamil Nadu', zone: 'SR', isJunction: true },
  { code: 'SBC', name: 'KSR Bengaluru (Bangalore City)', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR', isJunction: true },
  { code: 'YPR', name: 'Yesvantpur Junction', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR', isJunction: true },
  { code: 'SMVB', name: 'Sir M. Visvesvaraya Terminal', city: 'Bengaluru', state: 'Karnataka', zone: 'SWR' },
  { code: 'HYB', name: 'Hyderabad Deccan (Nampally)', city: 'Hyderabad', state: 'Telangana', zone: 'SCR' },
  { code: 'SC', name: 'Secunderabad Junction', city: 'Secunderabad', state: 'Telangana', zone: 'SCR', isJunction: true },
  { code: 'TVC', name: 'Thiruvananthapuram Central', city: 'Thiruvananthapuram', state: 'Kerala', zone: 'SR' },
  { code: 'ERS', name: 'Ernakulam Junction (South)', city: 'Kochi', state: 'Kerala', zone: 'SR', isJunction: true },
  { code: 'CBE', name: 'Coimbatore Junction', city: 'Coimbatore', state: 'Tamil Nadu', zone: 'SR', isJunction: true },
  { code: 'MDU', name: 'Madurai Junction', city: 'Madurai', state: 'Tamil Nadu', zone: 'SR', isJunction: true },

  // Northern & Central Hubs
  { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh', zone: 'NR', isJunction: true },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh', zone: 'NCR', isJunction: true },
  { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow', state: 'Uttar Pradesh', zone: 'NR', isJunction: true },
  { code: 'PRYJ', name: 'Prayagraj Junction (Allahabad)', city: 'Prayagraj', state: 'Uttar Pradesh', zone: 'NCR', isJunction: true },
  { code: 'GKP', name: 'Gorakhpur Junction', city: 'Gorakhpur', state: 'Uttar Pradesh', zone: 'NER', isJunction: true },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar', zone: 'ECR', isJunction: true },
  { code: 'DNR', name: 'Danapur', city: 'Patna', state: 'Bihar', zone: 'ECR' },
  { code: 'GAYA', name: 'Gaya Junction', city: 'Gaya', state: 'Bihar', zone: 'ECR', isJunction: true },
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh', zone: 'WCR', isJunction: true },
  { code: 'RKMP', name: 'Rani Kamalapati (Habibganj)', city: 'Bhopal', state: 'Madhya Pradesh', zone: 'WCR' },
  { code: 'JBP', name: 'Jabalpur Junction', city: 'Jabalpur', state: 'Madhya Pradesh', zone: 'WCR', isJunction: true },
  { code: 'GWL', name: 'Gwalior Junction', city: 'Gwalior', state: 'Madhya Pradesh', zone: 'NCR', isJunction: true },

  // Western & Northwestern Hubs
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat', zone: 'WR', isJunction: true },
  { code: 'BRC', name: 'Vadodara Junction', city: 'Vadodara', state: 'Gujarat', zone: 'WR', isJunction: true },
  { code: 'ST', name: 'Surat', city: 'Surat', state: 'Gujarat', zone: 'WR' },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan', zone: 'NWR', isJunction: true },
  { code: 'JU', name: 'Jodhpur Junction', city: 'Jodhpur', state: 'Rajasthan', zone: 'NWR', isJunction: true },
  { code: 'AII', name: 'Ajmer Junction', city: 'Ajmer', state: 'Rajasthan', zone: 'NWR', isJunction: true },
  { code: 'KOTA', name: 'Kota Junction', city: 'Kota', state: 'Rajasthan', zone: 'WCR', isJunction: true },

  // Eastern & Northeast Hubs
  { code: 'BBS', name: 'Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', zone: 'ECoR' },
  { code: 'CTC', name: 'Cuttack Junction', city: 'Cuttack', state: 'Odisha', zone: 'ECoR', isJunction: true },
  { code: 'PURI', name: 'Puri', city: 'Puri', state: 'Odisha', zone: 'ECoR' },
  { code: 'GHY', name: 'Guwahati', city: 'Guwahati', state: 'Assam', zone: 'NFR', isJunction: true },
  { code: 'R', name: 'Raipur Junction', city: 'Raipur', state: 'Chhattisgarh', zone: 'SECR', isJunction: true },
  { code: 'BSP', name: 'Bilaspur Junction', city: 'Bilaspur', state: 'Chhattisgarh', zone: 'SECR', isJunction: true },
  { code: 'ASR', name: 'Amritsar Junction', city: 'Amritsar', state: 'Punjab', zone: 'NR' },
  { code: 'CDG', name: 'Chandigarh Junction', city: 'Chandigarh', state: 'Chandigarh', zone: 'NR' },
  { code: 'JAT', name: 'Jammu Tawi', city: 'Jammu', state: 'Jammu and Kashmir', zone: 'NR' },
  { code: 'SVDK', name: 'Shri Mata Vaishno Devi Katra', city: 'Katra', state: 'Jammu and Kashmir', zone: 'NR' },
  { code: 'MAO', name: 'Madgaon Junction (Goa)', city: 'Madgaon', state: 'Goa', zone: 'KR', isJunction: true }
];
