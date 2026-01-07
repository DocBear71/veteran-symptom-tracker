import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Volume2, AlertCircle, Info, ArrowLeft, ExternalLink } from 'lucide-react';

/**
 * MOS Noise Exposure Lookup Component
 *
 * Based on the official VA Duty MOS Noise Exposure Listing (March 2022)
 * Helps veterans identify if their MOS/AFSC/NEC has presumptive noise exposure
 * for tinnitus and hearing loss claims.
 *
 * Exposure Levels:
 * - HIGH: Highly Probable noise exposure
 * - MOD: Moderate probability noise exposure
 * - LOW: Low probability noise exposure
 */

// === NOISE EXPOSURE DATA ===
// Source: VA Duty MOS Noise Exposure Listing, March 2022

const ARMY_ENLISTED = [
  // Infantry & Combat Arms - HIGH exposure
  { code: '11B', title: 'Infantryman', exposure: 'HIGH' },
  { code: '11C', title: 'Indirect Fire Infantryman', exposure: 'HIGH' },
  { code: '11Z', title: 'Infantry Senior Sergeant', exposure: 'HIGH' },
  { code: '12B', title: 'Combat Engineer', exposure: 'HIGH' },
  { code: '12C', title: 'Bridge Crewmember', exposure: 'HIGH' },
  { code: '12D', title: 'Diver', exposure: 'MOD' },
  { code: '12G', title: 'Quarrying Specialist', exposure: 'HIGH' },
  { code: '12H', title: 'Construction Engineering Supervisor', exposure: 'MOD' },
  { code: '12K', title: 'Plumber', exposure: 'MOD' },
  { code: '12M', title: 'Firefighter', exposure: 'HIGH' },
  { code: '12N', title: 'Horizontal Construction Engineer', exposure: 'HIGH' },
  { code: '12P', title: 'Prime Power Production Specialist', exposure: 'HIGH' },
  { code: '12Q', title: 'Power Line Distribution Specialist', exposure: 'MOD' },
  { code: '12R', title: 'Interior Electrician', exposure: 'MOD' },
  { code: '12T', title: 'Technical Engineer', exposure: 'LOW' },
  { code: '12V', title: 'Concrete and Asphalt Equipment Operator', exposure: 'HIGH' },
  { code: '12W', title: 'Carpentry and Masonry Specialist', exposure: 'HIGH' },
  { code: '12X', title: 'General Engineering Supervisor', exposure: 'MOD' },
  { code: '12Y', title: 'Geospatial Engineer', exposure: 'LOW' },
  { code: '12Z', title: 'Combat Engineering Senior Sergeant', exposure: 'HIGH' },

  // Field Artillery - HIGH exposure
  { code: '13B', title: 'Cannon Crewmember', exposure: 'HIGH' },
  { code: '13C', title: 'Tactical Automated Fire Control Systems Specialist', exposure: 'HIGH' },
  { code: '13D', title: 'Field Artillery Automated Tactical Data System Specialist', exposure: 'HIGH' },
  { code: '13E', title: 'Cannon Fire Direction Specialist', exposure: 'HIGH' },
  { code: '13F', title: 'Fire Support Specialist', exposure: 'HIGH' },
  { code: '13P', title: 'MLRS Operational Fire Direction Specialist', exposure: 'HIGH' },
  { code: '13R', title: 'Field Artillery Firefinder Radar Operator', exposure: 'HIGH' },
  { code: '13S', title: 'Field Artillery Surveyor', exposure: 'HIGH' },
  { code: '13T', title: 'Field Artillery Surveyor/Meteorological Crewmember', exposure: 'HIGH' },
  { code: '13W', title: 'Field Artillery Meteorological Crewmember', exposure: 'HIGH' },
  { code: '13Z', title: 'Field Artillery Senior Sergeant', exposure: 'HIGH' },

  // Air Defense Artillery
  { code: '14E', title: 'Patriot Fire Control Enhanced Operator/Maintainer', exposure: 'HIGH' },
  { code: '14G', title: 'Air Defense Battle Management System Operator', exposure: 'MOD' },
  { code: '14M', title: 'Man Portable Air Defense System Crewmember', exposure: 'HIGH' },
  { code: '14S', title: 'Air and Missile Defense Crewmember', exposure: 'HIGH' },
  { code: '14T', title: 'Patriot Launching Station Enhanced Operator/Maintainer', exposure: 'HIGH' },
  { code: '14Z', title: 'Air Defense Artillery Senior Sergeant', exposure: 'HIGH' },

  // Aviation - HIGH exposure
  { code: '15B', title: 'Aircraft Powerplant Repairer', exposure: 'HIGH' },
  { code: '15D', title: 'Aircraft Powertrain Repairer', exposure: 'HIGH' },
  { code: '15F', title: 'Aircraft Electrician', exposure: 'HIGH' },
  { code: '15G', title: 'Aircraft Structural Repairer', exposure: 'HIGH' },
  { code: '15H', title: 'Aircraft Pneudraulics Repairer', exposure: 'HIGH' },
  { code: '15J', title: 'OH-58D/ARH Armament/Electrical/Avionics Systems Repairer', exposure: 'HIGH' },
  { code: '15K', title: 'Aircraft Components Repair Supervisor', exposure: 'HIGH' },
  { code: '15M', title: 'UH-1 Helicopter Repairer', exposure: 'HIGH' },
  { code: '15N', title: 'Avionics Mechanic', exposure: 'HIGH' },
  { code: '15P', title: 'Aviation Operations Specialist', exposure: 'MOD' },
  { code: '15Q', title: 'Air Traffic Control Operator', exposure: 'MOD' },
  { code: '15R', title: 'AH-64 Attack Helicopter Repairer', exposure: 'HIGH' },
  { code: '15S', title: 'OH-58D/ARH Helicopter Repairer', exposure: 'HIGH' },
  { code: '15T', title: 'UH-60 Helicopter Repairer', exposure: 'HIGH' },
  { code: '15U', title: 'CH-47 Helicopter Repairer', exposure: 'HIGH' },
  { code: '15V', title: 'Observation/Scout Helicopter Repairer', exposure: 'HIGH' },
  { code: '15W', title: 'Unmanned Aerial Vehicle Operator', exposure: 'MOD' },
  { code: '15X', title: 'AH-64A Armament/Electrical/Avionics Systems Repairer', exposure: 'HIGH' },
  { code: '15Y', title: 'AH-64D Armament/Electrical/Avionics Systems Repairer', exposure: 'HIGH' },
  { code: '15Z', title: 'Aircraft Maintenance Senior Sergeant', exposure: 'HIGH' },

  // Special Forces - HIGH exposure
  { code: '18B', title: 'Special Forces Weapons Sergeant', exposure: 'HIGH' },
  { code: '18C', title: 'Special Forces Engineer Sergeant', exposure: 'HIGH' },
  { code: '18D', title: 'Special Forces Medical Sergeant', exposure: 'HIGH' },
  { code: '18E', title: 'Special Forces Communications Sergeant', exposure: 'HIGH' },
  { code: '18F', title: 'Special Forces Assistant Operations & Intelligence Sergeant', exposure: 'HIGH' },
  { code: '18Z', title: 'Special Forces Senior Sergeant', exposure: 'HIGH' },

  // Armor/Cavalry - HIGH exposure
  { code: '19D', title: 'Cavalry Scout', exposure: 'HIGH' },
  { code: '19K', title: 'M1 Armor Crewman', exposure: 'HIGH' },
  { code: '19Z', title: 'Armor Senior Sergeant', exposure: 'HIGH' },

  // Signal Corps - varies
  { code: '25B', title: 'Information Technology Specialist', exposure: 'LOW' },
  { code: '25C', title: 'Radio Operator-Maintainer', exposure: 'MOD' },
  { code: '25E', title: 'Electromagnetic Spectrum Manager', exposure: 'LOW' },
  { code: '25L', title: 'Cable Systems Installer-Maintainer', exposure: 'MOD' },
  { code: '25M', title: 'Multimedia Illustrator', exposure: 'LOW' },
  { code: '25N', title: 'Nodal Network Systems Operator-Maintainer', exposure: 'MOD' },
  { code: '25P', title: 'Microwave Systems Operator-Maintainer', exposure: 'MOD' },
  { code: '25Q', title: 'Multichannel Transmission Systems Operator-Maintainer', exposure: 'MOD' },
  { code: '25R', title: 'Visual Information Equipment Operator-Maintainer', exposure: 'LOW' },
  { code: '25S', title: 'Satellite Communication Systems Operator-Maintainer', exposure: 'MOD' },
  { code: '25U', title: 'Signal Support Systems Specialist', exposure: 'MOD' },

  // Military Police
  { code: '31B', title: 'Military Police', exposure: 'HIGH' },
  { code: '31D', title: 'CID Special Agent', exposure: 'MOD' },
  { code: '31E', title: 'Internment/Resettlement Specialist', exposure: 'MOD' },

  // Intelligence - LOW exposure
  { code: '35F', title: 'Intelligence Analyst', exposure: 'LOW' },
  { code: '35G', title: 'Imagery Analyst', exposure: 'LOW' },
  { code: '35L', title: 'Counter Intelligence Agent', exposure: 'LOW' },
  { code: '35M', title: 'Human Intelligence Collector', exposure: 'LOW' },
  { code: '35N', title: 'Signals Intelligence Analyst', exposure: 'LOW' },
  { code: '35P', title: 'Cryptologic Linguist', exposure: 'LOW' },

  // Administrative - LOW exposure
  { code: '42A', title: 'Human Resources Specialist', exposure: 'LOW' },
  { code: '42R', title: 'Army Bandperson', exposure: 'HIGH' },
  { code: '42S', title: 'Special Band Member', exposure: 'HIGH' },

  // Medical - LOW exposure
  { code: '68A', title: 'Biomedical Equipment Specialist', exposure: 'LOW' },
  { code: '68D', title: 'Operating Room Specialist', exposure: 'LOW' },
  { code: '68E', title: 'Dental Specialist', exposure: 'MOD' },
  { code: '68W', title: 'Health Care Specialist (Combat Medic)', exposure: 'HIGH' },
  { code: '68X', title: 'Behavioral Health Specialist', exposure: 'LOW' },

  // CBRN
  { code: '74D', title: 'Chemical, Biological, Radiological and Nuclear Specialist', exposure: 'HIGH' },

  // Transportation
  { code: '88H', title: 'Cargo Specialist', exposure: 'HIGH' },
  { code: '88K', title: 'Watercraft Operator', exposure: 'HIGH' },
  { code: '88L', title: 'Watercraft Engineer', exposure: 'HIGH' },
  { code: '88M', title: 'Motor Transport Operator', exposure: 'HIGH' },
  { code: '88N', title: 'Transportation Management Coordinator', exposure: 'LOW' },

  // Ammunition/EOD - HIGH exposure
  { code: '89A', title: 'Ammunition Stock Control & Accounting Specialist', exposure: 'MOD' },
  { code: '89B', title: 'Ammunition Specialist', exposure: 'HIGH' },
  { code: '89D', title: 'Explosive Ordnance Disposal Specialist', exposure: 'HIGH' },

  // Maintenance - HIGH exposure
  { code: '91A', title: 'M1 Abrams Tank System Maintainer', exposure: 'HIGH' },
  { code: '91B', title: 'Wheeled Vehicle Mechanic', exposure: 'HIGH' },
  { code: '91C', title: 'Utilities Equipment Repairer', exposure: 'HIGH' },
  { code: '91D', title: 'Power-Generation Equipment Repairer', exposure: 'HIGH' },
  { code: '91E', title: 'Allied Trades Specialist', exposure: 'HIGH' },
  { code: '91F', title: 'Small Arms/Artillery Repairer', exposure: 'HIGH' },
  { code: '91J', title: 'Quartermaster & Chemical Equipment Repairer', exposure: 'HIGH' },
  { code: '91K', title: 'Armament Repairer', exposure: 'HIGH' },
  { code: '91W', title: 'Metal Worker', exposure: 'HIGH' },

  // Supply/Logistics - varies
  { code: '92A', title: 'Automated Logistical Specialist', exposure: 'LOW' },
  { code: '92F', title: 'Petroleum Supply Specialist', exposure: 'HIGH' },
  { code: '92G', title: 'Food Service Specialist', exposure: 'MOD' },
  { code: '92R', title: 'Parachute Rigger', exposure: 'MOD' },
  { code: '92W', title: 'Water Treatment Specialist', exposure: 'MOD' },
  { code: '92Y', title: 'Unit Supply Specialist', exposure: 'LOW' },

  // Electronic Maintenance - HIGH exposure
  { code: '94A', title: 'Land Combat Electronic Missile System Repairer', exposure: 'HIGH' },
  { code: '94D', title: 'Air Traffic Control Equipment Repairer', exposure: 'MOD' },
  { code: '94E', title: 'Radio & Communications Security Repairer', exposure: 'MOD' },
  { code: '94F', title: 'Computer Detection Systems Repairer', exposure: 'MOD' },
  { code: '94K', title: 'Apache Attack Helicopter Systems Repairer', exposure: 'HIGH' },
  { code: '94M', title: 'Radar Repairer', exposure: 'HIGH' },
  { code: '94P', title: 'Multiple Launch Rocket System Repairer', exposure: 'HIGH' },
  { code: '94S', title: 'Patriot System Repairer', exposure: 'HIGH' },
];

const ARMY_OFFICER = [
  { code: '11A', title: 'Infantry Officer', exposure: 'HIGH' },
  { code: '12A', title: 'Engineer Officer', exposure: 'HIGH' },
  { code: '13A', title: 'Field Artillery Officer', exposure: 'HIGH' },
  { code: '14A', title: 'Air Defense Artillery Officer', exposure: 'HIGH' },
  { code: '15A', title: 'Aviation Officer', exposure: 'HIGH' },
  { code: '18A', title: 'Special Forces Officer', exposure: 'HIGH' },
  { code: '19A', title: 'Armor Officer', exposure: 'HIGH' },
  { code: '25A', title: 'Signal Officer', exposure: 'MOD' },
  { code: '31A', title: 'Military Police Officer', exposure: 'HIGH' },
  { code: '74A', title: 'CBRN Officer', exposure: 'HIGH' },
  { code: '88A', title: 'Transportation Officer', exposure: 'MOD' },
  { code: '89E', title: 'Explosive Ordnance Disposal Officer', exposure: 'HIGH' },
  { code: '91A', title: 'Maintenance & Munitions Officer', exposure: 'HIGH' },
];

const ARMY_WARRANT = [
  { code: '131A', title: 'Field Artillery Targeting Technician', exposure: 'HIGH' },
  { code: '140A', title: 'Command & Control Systems Integrator', exposure: 'MOD' },
  { code: '140E', title: 'Air and Missile Defense Systems Tactician', exposure: 'HIGH' },
  { code: '150A', title: 'Air Traffic and Air Space Management Technician', exposure: 'MOD' },
  { code: '151A', title: 'Aviation Maintenance Technician', exposure: 'HIGH' },
  { code: '152D', title: 'OH-58D Pilot', exposure: 'HIGH' },
  { code: '152F', title: 'AH-64A Attack Pilot', exposure: 'HIGH' },
  { code: '152H', title: 'AH-64D Attack Pilot', exposure: 'HIGH' },
  { code: '153A', title: 'Rotary Wing Aviator', exposure: 'HIGH' },
  { code: '153D', title: 'UH-60 Pilot', exposure: 'HIGH' },
  { code: '153M', title: 'UH-60M Pilot', exposure: 'HIGH' },
  { code: '154C', title: 'CH-47D Pilot', exposure: 'HIGH' },
  { code: '154F', title: 'CH-47F Pilot', exposure: 'HIGH' },
  { code: '155A', title: 'Fixed Wing Aviator', exposure: 'HIGH' },
  { code: '180A', title: 'Special Forces Warrant Officer', exposure: 'HIGH' },
];

const NAVY_ENLISTED = [
  // Aviation Ratings - HIGH
  { code: 'AB', title: 'Aviation Boatswain\'s Mate', exposure: 'HIGH' },
  { code: 'ABE', title: 'Aviation Boatswain\'s Mate (Launching/Recovery)', exposure: 'HIGH' },
  { code: 'ABF', title: 'Aviation Boatswain\'s Mate (Fuels)', exposure: 'HIGH' },
  { code: 'ABH', title: 'Aviation Boatswain\'s Mate (Aircraft Handling)', exposure: 'HIGH' },
  { code: 'AC', title: 'Air Traffic Controller', exposure: 'MOD' },
  { code: 'AD', title: 'Aviation Machinist\'s Mate', exposure: 'HIGH' },
  { code: 'AE', title: 'Aviation Electrician\'s Mate', exposure: 'HIGH' },
  { code: 'AG', title: 'Aerographer\'s Mate', exposure: 'MOD' },
  { code: 'AM', title: 'Aviation Structural Mechanic', exposure: 'HIGH' },
  { code: 'AME', title: 'Aviation Structural Mechanic (Safety Equipment)', exposure: 'HIGH' },
  { code: 'AO', title: 'Aviation Ordnanceman', exposure: 'HIGH' },
  { code: 'AS', title: 'Aviation Support Equipment Technician', exposure: 'HIGH' },
  { code: 'AT', title: 'Aviation Electronics Technician', exposure: 'HIGH' },
  { code: 'AW', title: 'Aviation Aircrewman', exposure: 'HIGH' },
  { code: 'AWF', title: 'Aviation Aircrewman (Mechanical)', exposure: 'HIGH' },
  { code: 'AWO', title: 'Aviation Aircrewman (Operator)', exposure: 'HIGH' },
  { code: 'AWR', title: 'Aviation Aircrewman (Tactical Helicopter)', exposure: 'HIGH' },
  { code: 'AWS', title: 'Aviation Aircrewman (Helicopter)', exposure: 'HIGH' },
  { code: 'AWV', title: 'Aviation Aircrewman (Avionics)', exposure: 'HIGH' },
  { code: 'AZ', title: 'Aviation Maintenance Administrationman', exposure: 'MOD' },
  { code: 'PR', title: 'Aircrew Survival Equipmentman', exposure: 'HIGH' },

  // Deck Ratings
  { code: 'BM', title: 'Boatswain\'s Mate', exposure: 'HIGH' },
  { code: 'OS', title: 'Operations Specialist', exposure: 'MOD' },
  { code: 'QM', title: 'Quartermaster', exposure: 'MOD' },

  // Weapons/Combat
  { code: 'FC', title: 'Fire Controlman', exposure: 'HIGH' },
  { code: 'FT', title: 'Fire Control Technician', exposure: 'HIGH' },
  { code: 'GM', title: 'Gunner\'s Mate', exposure: 'HIGH' },
  { code: 'MN', title: 'Mineman', exposure: 'HIGH' },
  { code: 'MT', title: 'Missile Technician', exposure: 'HIGH' },
  { code: 'STG', title: 'Sonar Technician (Surface)', exposure: 'HIGH' },
  { code: 'STS', title: 'Sonar Technician (Submarine)', exposure: 'HIGH' },

  // Engineering
  { code: 'DC', title: 'Damage Controlman', exposure: 'HIGH' },
  { code: 'EM', title: 'Electrician\'s Mate', exposure: 'HIGH' },
  { code: 'EN', title: 'Engineman', exposure: 'HIGH' },
  { code: 'GS', title: 'Gas Turbine System Technician', exposure: 'HIGH' },
  { code: 'GSE', title: 'Gas Turbine System Technician (Electrical)', exposure: 'HIGH' },
  { code: 'GSM', title: 'Gas Turbine System Technician (Mechanical)', exposure: 'HIGH' },
  { code: 'HT', title: 'Hull Maintenance Technician', exposure: 'HIGH' },
  { code: 'IC', title: 'Interior Communications Electrician', exposure: 'MOD' },
  { code: 'MM', title: 'Machinist\'s Mate', exposure: 'HIGH' },
  { code: 'MR', title: 'Machinery Repairman', exposure: 'HIGH' },

  // Construction (Seabees) - HIGH
  { code: 'BU', title: 'Builder', exposure: 'HIGH' },
  { code: 'CE', title: 'Construction Electrician', exposure: 'HIGH' },
  { code: 'CM', title: 'Construction Mechanic', exposure: 'HIGH' },
  { code: 'EA', title: 'Engineering Aide', exposure: 'MOD' },
  { code: 'EO', title: 'Equipment Operator', exposure: 'HIGH' },
  { code: 'SW', title: 'Steelworker', exposure: 'HIGH' },
  { code: 'UT', title: 'Utilitiesman', exposure: 'HIGH' },

  // Special Warfare/EOD
  { code: 'EOD', title: 'Explosive Ordnance Disposal', exposure: 'HIGH' },
  { code: 'ND', title: 'Navy Diver', exposure: 'HIGH' },
  { code: 'SB', title: 'Special Operations Boat Operator', exposure: 'HIGH' },
  { code: 'SO', title: 'Special Operator (SEAL)', exposure: 'HIGH' },

  // Electronics/Communications
  { code: 'CT', title: 'Cryptologic Technician', exposure: 'LOW' },
  { code: 'ET', title: 'Electronics Technician', exposure: 'MOD' },
  { code: 'IT', title: 'Information Systems Technician', exposure: 'LOW' },

  // Medical
  { code: 'HM', title: 'Hospital Corpsman', exposure: 'MOD' },

  // Administrative - LOW
  { code: 'IS', title: 'Intelligence Specialist', exposure: 'LOW' },
  { code: 'LN', title: 'Legalman', exposure: 'LOW' },
  { code: 'LS', title: 'Logistics Specialist', exposure: 'MOD' },
  { code: 'MA', title: 'Master-at-Arms', exposure: 'HIGH' },
  { code: 'MC', title: 'Mass Communications Specialist', exposure: 'LOW' },
  { code: 'MU', title: 'Musician', exposure: 'HIGH' },
  { code: 'NC', title: 'Navy Counselor', exposure: 'LOW' },
  { code: 'PS', title: 'Personnel Specialist', exposure: 'LOW' },
  { code: 'RP', title: 'Religious Programs Specialist', exposure: 'LOW' },
  { code: 'YN', title: 'Yeoman', exposure: 'LOW' },
  { code: 'CS', title: 'Culinary Specialist', exposure: 'MOD' },
];

const MARINE_CORPS = [
  // Infantry (03XX)
  { code: '0311', title: 'Rifleman', exposure: 'HIGH' },
  { code: '0313', title: 'LAV Crewman', exposure: 'HIGH' },
  { code: '0321', title: 'Reconnaissance Man', exposure: 'HIGH' },
  { code: '0331', title: 'Machine Gunner', exposure: 'HIGH' },
  { code: '0341', title: 'Mortarman', exposure: 'HIGH' },
  { code: '0351', title: 'Infantry Assault', exposure: 'HIGH' },
  { code: '0352', title: 'Anti-Tank Missile Gunner', exposure: 'HIGH' },
  { code: '0369', title: 'Infantry Unit Leader', exposure: 'HIGH' },

  // Artillery (08XX)
  { code: '0811', title: 'Field Artillery Cannoneer', exposure: 'HIGH' },
  { code: '0842', title: 'Field Artillery Radar Operator', exposure: 'HIGH' },
  { code: '0844', title: 'Fire Direction Controlman', exposure: 'HIGH' },
  { code: '0861', title: 'Fire Support Man', exposure: 'HIGH' },

  // Tanks/AAV (18XX)
  { code: '1812', title: 'M1A1 Tank Crewman', exposure: 'HIGH' },
  { code: '1833', title: 'AAV Crewman', exposure: 'HIGH' },

  // EOD/Ordnance (23XX)
  { code: '2311', title: 'Ammunition Technician', exposure: 'HIGH' },
  { code: '2336', title: 'Explosive Ordnance Disposal Technician', exposure: 'HIGH' },

  // Communications (06XX)
  { code: '0621', title: 'Field Radio Operator', exposure: 'MOD' },
  { code: '0651', title: 'Cyber Network Operator', exposure: 'LOW' },

  // Engineers (13XX)
  { code: '1341', title: 'Engineer Equipment Operator', exposure: 'HIGH' },
  { code: '1345', title: 'Engineer Equipment Mechanic', exposure: 'HIGH' },
  { code: '1371', title: 'Combat Engineer', exposure: 'HIGH' },
  { code: '1391', title: 'Bulk Fuel Specialist', exposure: 'HIGH' },

  // Aviation (60XX-65XX)
  { code: '6012', title: 'Aviation Supply Specialist', exposure: 'MOD' },
  { code: '6019', title: 'Aircraft Maintenance Chief', exposure: 'HIGH' },
  { code: '6042', title: 'Individual Material Readiness List Asset Manager', exposure: 'LOW' },
  { code: '6046', title: 'Aircraft Maintenance Administration Specialist', exposure: 'LOW' },
  { code: '6048', title: 'Flight Equipment Technician', exposure: 'HIGH' },
  { code: '6062', title: 'Aircraft Intermediate Level Hydraulic/Pneumatic Mechanic', exposure: 'HIGH' },
  { code: '6072', title: 'Aircraft Maintenance Support Equipment Electrician/Refrigeration Mechanic', exposure: 'HIGH' },
  { code: '6073', title: 'Aircraft Maintenance Support Equipment Hydraulic/Pneumatic/Structures Mechanic', exposure: 'HIGH' },
  { code: '6074', title: 'Cryogenics Equipment Operator', exposure: 'HIGH' },
  { code: '6092', title: 'Aircraft Intermediate Level Structures Mechanic', exposure: 'HIGH' },
  { code: '6111', title: 'Helicopter/Tiltrotor Mechanic, CH-53', exposure: 'HIGH' },
  { code: '6112', title: 'Helicopter Mechanic, UH/AH-1', exposure: 'HIGH' },
  { code: '6113', title: 'Helicopter/Tiltrotor Mechanic, MV-22', exposure: 'HIGH' },
  { code: '6114', title: 'Helicopter/Tiltrotor Powerplants Mechanic, CH-53', exposure: 'HIGH' },
  { code: '6116', title: 'Tiltrotor Mechanic, MV-22', exposure: 'HIGH' },
  { code: '6122', title: 'Helicopter Power Plants Mechanic, UH/AH-1', exposure: 'HIGH' },
  { code: '6123', title: 'Helicopter/Tiltrotor Crew Chief, CH-46', exposure: 'HIGH' },
  { code: '6124', title: 'Helicopter/Tiltrotor Crew Chief, CH-53', exposure: 'HIGH' },
  { code: '6132', title: 'Helicopter/Tiltrotor Crew Chief, UH-1/AH-1', exposure: 'HIGH' },
  { code: '6152', title: 'Helicopter Airframe Mechanic, CH-53', exposure: 'HIGH' },
  { code: '6153', title: 'Helicopter Airframe Mechanic, CH-46', exposure: 'HIGH' },
  { code: '6154', title: 'Helicopter/Tiltrotor Airframe Mechanic, UH-1/AH-1', exposure: 'HIGH' },
  { code: '6156', title: 'Tiltrotor Airframe Mechanic, MV-22', exposure: 'HIGH' },
  { code: '6172', title: 'Helicopter/Tiltrotor Crew Chief, CH-53E', exposure: 'HIGH' },
  { code: '6173', title: 'Helicopter Crew Chief, CH-46', exposure: 'HIGH' },
  { code: '6174', title: 'Helicopter Crew Chief, UH-1N', exposure: 'HIGH' },
  { code: '6176', title: 'Tiltrotor Crew Chief, MV-22', exposure: 'HIGH' },
  { code: '6212', title: 'Fixed-Wing Aircraft Mechanic, EA-6/F/A-18', exposure: 'HIGH' },
  { code: '6214', title: 'Intermediate Level Structures Mechanic, Fixed-Wing', exposure: 'HIGH' },
  { code: '6216', title: 'Fixed-Wing Aircraft Mechanic, KC-130', exposure: 'HIGH' },
  { code: '6217', title: 'Fixed-Wing Aircraft Mechanic, F-35', exposure: 'HIGH' },
  { code: '6218', title: 'Fixed-Wing Crew Chief, EA-6/AV-8', exposure: 'HIGH' },
  { code: '6222', title: 'Fixed-Wing Aircraft Power Plants Mechanic, F/A-18', exposure: 'HIGH' },
  { code: '6227', title: 'Fixed-Wing Aircraft Power Plants Mechanic, F-35', exposure: 'HIGH' },
  { code: '6252', title: 'Fixed-Wing Aircraft Airframe Mechanic, EA-6/F/A-18', exposure: 'HIGH' },
  { code: '6256', title: 'Fixed-Wing Aircraft Airframe Mechanic, KC-130', exposure: 'HIGH' },
  { code: '6257', title: 'Fixed-Wing Aircraft Airframe Mechanic, F-35', exposure: 'HIGH' },
  { code: '6276', title: 'Fixed-Wing Crew Chief, KC-130', exposure: 'HIGH' },
  { code: '6282', title: 'Fixed-Wing Aircraft Safety Equipment Mechanic, EA-6/F/A-18/AV-8', exposure: 'HIGH' },
  { code: '6286', title: 'Fixed-Wing Aircraft Safety Equipment Mechanic, KC-130', exposure: 'HIGH' },
  { code: '6287', title: 'Fixed-Wing Aircraft Safety Equipment Mechanic, F-35', exposure: 'HIGH' },
  { code: '6311', title: 'Aircraft Communications/Navigation/Electrical/Weapons Systems Technician, AH-1', exposure: 'HIGH' },
  { code: '6312', title: 'Aircraft Communications/Navigation/Electrical/Weapon Systems Technician, CH-46/53', exposure: 'HIGH' },
  { code: '6313', title: 'Aircraft Communications/Navigation/Radar Systems Technician, CH-53', exposure: 'HIGH' },
  { code: '6314', title: 'Unmanned Aerial Vehicle (UAV) Avionics Technician', exposure: 'MOD' },
  { code: '6316', title: 'Aircraft Communications/Navigation/Electrical/Weapons Systems Technician, MV-22', exposure: 'HIGH' },
  { code: '6317', title: 'Aircraft Communications/Navigation Systems Technician, KC-130', exposure: 'HIGH' },
  { code: '6322', title: 'Aircraft Communications/Navigation/Electrical Systems Technician, EA-6/AV-8/F/A-18', exposure: 'HIGH' },
  { code: '6323', title: 'Aircraft Communications/Navigation Systems Technician, EA-6', exposure: 'HIGH' },
  { code: '6324', title: 'Aircraft Communications/Navigation/Weapons Systems Technician, AV-8', exposure: 'HIGH' },
  { code: '6326', title: 'Aircraft Communications/Navigation/Electrical/Weapons Systems Technician, F/A-18', exposure: 'HIGH' },
  { code: '6327', title: 'Fixed-Wing Aircraft Avionics Technician, F-35', exposure: 'HIGH' },
  { code: '6332', title: 'Aircraft Electrical Systems Technician, UH-1/AH-1/CH-53', exposure: 'HIGH' },
  { code: '6333', title: 'Aircraft Electrical Systems Technician, CH-46/53', exposure: 'HIGH' },
  { code: '6336', title: 'Aircraft Electrical Systems Technician, MV-22', exposure: 'HIGH' },
  { code: '6338', title: 'Aircraft Electrical Systems Technician, KC-130', exposure: 'HIGH' },
  { code: '6386', title: 'Aircraft Electronic Countermeasures Systems Technician, EA-6', exposure: 'HIGH' },
  { code: '6391', title: 'Avionics Maintenance Chief', exposure: 'HIGH' },
  { code: '6412', title: 'Aircraft Firefighting and Rescue Specialist', exposure: 'HIGH' },
  { code: '6423', title: 'Aviation Operations Specialist', exposure: 'MOD' },
  { code: '6432', title: 'Flight Meteorological Observer', exposure: 'MOD' },
  { code: '6461', title: 'Observation Squadron Operations Chief', exposure: 'MOD' },
  { code: '6469', title: 'Aviation Operations Chief', exposure: 'MOD' },
  { code: '6483', title: 'Aircraft Maintenance Scheduler', exposure: 'LOW' },
  { code: '6492', title: 'Aviation Logistics Information Management Systems Specialist', exposure: 'LOW' },
  { code: '6502', title: 'Aviation Ordnance Technician', exposure: 'HIGH' },
  { code: '6511', title: 'Aviation Ordnance Technician, Fixed-Wing', exposure: 'HIGH' },
  { code: '6531', title: 'Aircraft Ordnance Technician', exposure: 'HIGH' },
  { code: '6541', title: 'Aviation Ordnance Systems Technician', exposure: 'HIGH' },
  { code: '6591', title: 'Aviation Ordnance Chief', exposure: 'HIGH' },

  // Motor Transport (35XX)
  { code: '3521', title: 'Automotive Organizational Mechanic', exposure: 'HIGH' },
  { code: '3531', title: 'Motor Vehicle Operator', exposure: 'HIGH' },

  // Supply/Logistics - varies
  { code: '0431', title: 'Logistics/Embarkation Specialist', exposure: 'MOD' },
  { code: '3043', title: 'Supply Administration and Operations Clerk', exposure: 'LOW' },
  { code: '3051', title: 'Warehouse Clerk', exposure: 'MOD' },

  // Admin - LOW
  { code: '0111', title: 'Administrative Specialist', exposure: 'LOW' },
  { code: '0121', title: 'Personnel Clerk', exposure: 'LOW' },
  { code: '0151', title: 'Administrative Clerk', exposure: 'LOW' },
  { code: '0161', title: 'Postal Clerk', exposure: 'LOW' },
  { code: '0171', title: 'Budget Technician', exposure: 'LOW' },
  { code: '0193', title: 'Personnel/Administrative Chief', exposure: 'LOW' },

  // Intel - LOW
  { code: '0231', title: 'Intelligence Specialist', exposure: 'LOW' },
  { code: '0241', title: 'Imagery Analysis Specialist', exposure: 'LOW' },
  { code: '0261', title: 'Geographic Intelligence Specialist', exposure: 'LOW' },
];

const AIR_FORCE_ENLISTED = [
  // Operations - varies
  { code: '1A0X1', title: 'In-Flight Refueling', exposure: 'HIGH' },
  { code: '1A1X1', title: 'Flight Engineer', exposure: 'HIGH' },
  { code: '1A2X1', title: 'Loadmaster', exposure: 'HIGH' },
  { code: '1A3X1', title: 'Airborne Communications Systems', exposure: 'HIGH' },
  { code: '1A4X1', title: 'Airborne Battle Management', exposure: 'HIGH' },
  { code: '1A5X1', title: 'Airborne Missions Systems', exposure: 'HIGH' },
  { code: '1C0X1', title: 'Airfield Management', exposure: 'MOD' },
  { code: '1C0X2', title: 'Operations Resource Management', exposure: 'LOW' },
  { code: '1C1X1', title: 'Air Traffic Control', exposure: 'MOD' },
  { code: '1C2X1', title: 'Combat Control', exposure: 'HIGH' },
  { code: '1C3X1', title: 'Command Post', exposure: 'LOW' },
  { code: '1C4X1', title: 'Tactical Air Command and Control', exposure: 'MOD' },
  { code: '1C5X1', title: 'Aerospace Control and Warning Systems', exposure: 'MOD' },
  { code: '1C6X1', title: 'Space Systems Operations', exposure: 'LOW' },
  { code: '1T0X1', title: 'Survival, Evasion, Resistance, and Escape Training', exposure: 'HIGH' },
  { code: '1T1X1', title: 'Aircrew Life Support', exposure: 'MOD' },
  { code: '1T2X1', title: 'Pararescue', exposure: 'HIGH' },
  { code: '1W0X1', title: 'Weather', exposure: 'MOD' },

  // Intelligence - LOW
  { code: '1N0X1', title: 'Intelligence Applications', exposure: 'LOW' },
  { code: '1N1X1', title: 'Imagery Analysis', exposure: 'LOW' },
  { code: '1N2X1', title: 'Signals Intelligence Production', exposure: 'LOW' },
  { code: '1N3X1', title: 'Cryptologic Linguist', exposure: 'LOW' },
  { code: '1N4X1', title: 'Signals Intelligence Analysis', exposure: 'LOW' },
  { code: '1N5X1', title: 'Electronic Signals Intelligence Exploitation', exposure: 'LOW' },
  { code: '1N6X1', title: 'Electronic System Security Assessment', exposure: 'LOW' },
  { code: '1S0X1', title: 'Safety', exposure: 'LOW' },

  // Maintenance - HIGH
  { code: '2A0X1', title: 'Avionics Test Station and Components', exposure: 'HIGH' },
  { code: '2A1X1', title: 'Avionics Sensors Maintenance', exposure: 'HIGH' },
  { code: '2A1X2', title: 'Avionics Guidance & Control Systems', exposure: 'HIGH' },
  { code: '2A1X3', title: 'Communication & Navigation Systems', exposure: 'HIGH' },
  { code: '2A1X4', title: 'Airborne Surveillance Radar Systems', exposure: 'HIGH' },
  { code: '2A1X7', title: 'Electronic Warfare Systems', exposure: 'HIGH' },
  { code: '2A3X1', title: 'F-15/F-111 Avionics Systems', exposure: 'HIGH' },
  { code: '2A3X2', title: 'F-16/F-117/CV-22 Avionic Systems', exposure: 'HIGH' },
  { code: '2A3X3', title: 'Tactical Aircraft Maintenance', exposure: 'HIGH' },
  { code: '2A4X1', title: 'Aircraft Guidance & Control', exposure: 'HIGH' },
  { code: '2A4X2', title: 'Aircraft Communication & Navigation Systems', exposure: 'HIGH' },
  { code: '2A5X1', title: 'Aerospace Maintenance', exposure: 'HIGH' },
  { code: '2A5X2', title: 'Helicopter Maintenance', exposure: 'HIGH' },
  { code: '2A5X3', title: 'Bomber Avionics Systems', exposure: 'HIGH' },
  { code: '2A6X1', title: 'Aerospace Propulsion', exposure: 'HIGH' },
  { code: '2A6X2', title: 'Aerospace Ground Equipment', exposure: 'HIGH' },
  { code: '2A6X3', title: 'Aircrew Egress Systems', exposure: 'HIGH' },
  { code: '2A6X4', title: 'Aircraft Fuel Systems', exposure: 'HIGH' },
  { code: '2A6X5', title: 'Aircraft Hydraulic Systems', exposure: 'HIGH' },
  { code: '2A6X6', title: 'Aircraft Electrical and Environmental Systems', exposure: 'HIGH' },
  { code: '2A7X1', title: 'Aircraft Metals Technology', exposure: 'HIGH' },
  { code: '2A7X2', title: 'Nondestructive Inspection', exposure: 'MOD' },
  { code: '2A7X3', title: 'Aircraft Structural Maintenance', exposure: 'HIGH' },
  { code: '2A7X4', title: 'Survival Equipment', exposure: 'MOD' },

  // Electronics/Comm - varies
  { code: '2E0X1', title: 'Ground Radar Systems', exposure: 'HIGH' },
  { code: '2E1X1', title: 'Satellite and Wideband Communications Equipment', exposure: 'MOD' },
  { code: '2E1X2', title: 'Meteorological and Navigation Systems', exposure: 'MOD' },
  { code: '2E1X3', title: 'Ground Radio Communications', exposure: 'MOD' },
  { code: '2E2X1', title: 'Electronic Computer and Switching Systems', exposure: 'MOD' },
  { code: '2E6X1', title: 'Communications Antenna Systems', exposure: 'MOD' },
  { code: '2E6X2', title: 'Communication Cable Systems', exposure: 'MOD' },

  // Logistics - varies
  { code: '2F0X1', title: 'Fuels', exposure: 'HIGH' },
  { code: '2G0X1', title: 'Logistics Plans', exposure: 'LOW' },
  { code: '2R0X1', title: 'Maintenance Data Systems Analyst', exposure: 'LOW' },
  { code: '2R1X1', title: 'Maintenance Scheduling', exposure: 'LOW' },
  { code: '2S0X1', title: 'Supply Management', exposure: 'LOW' },
  { code: '2S0X2', title: 'Supply Systems Analyst', exposure: 'LOW' },
  { code: '2T0X1', title: 'Traffic Management', exposure: 'LOW' },
  { code: '2T1X1', title: 'Vehicle Operations', exposure: 'HIGH' },
  { code: '2T2X1', title: 'Air Transportation', exposure: 'HIGH' },
  { code: '2T3X1', title: 'Special Purpose Vehicle and Equipment Maintenance', exposure: 'HIGH' },
  { code: '2T3X2', title: 'Special Vehicle Maintenance', exposure: 'HIGH' },
  { code: '2T3X4', title: 'General Purpose Vehicle Mechanic', exposure: 'HIGH' },
  { code: '2T3X5', title: 'Vehicle Body Maintenance', exposure: 'HIGH' },

  // Weapons/Munitions - HIGH
  { code: '2M0X1', title: 'Missile and Space Systems Electronic Maintenance', exposure: 'HIGH' },
  { code: '2M0X2', title: 'Missile and Space Systems Maintenance', exposure: 'HIGH' },
  { code: '2M0X3', title: 'Missile and Space Facilities', exposure: 'HIGH' },
  { code: '2W0X1', title: 'Munitions Systems', exposure: 'HIGH' },
  { code: '2W1X1', title: 'Aircraft Armament Systems', exposure: 'HIGH' },
  { code: '2W2X1', title: 'Nuclear Weapons', exposure: 'HIGH' },

  // Civil Engineering - HIGH
  { code: '3E0X1', title: 'Electrical', exposure: 'HIGH' },
  { code: '3E0X2', title: 'Electrical Power Production', exposure: 'HIGH' },
  { code: '3E1X1', title: 'Heating, Ventilation, AC, & Refrigeration', exposure: 'HIGH' },
  { code: '3E2X1', title: 'Pavement and Construction Equipment', exposure: 'HIGH' },
  { code: '3E3X1', title: 'Structural', exposure: 'HIGH' },
  { code: '3E4X1', title: 'Utilities Systems', exposure: 'HIGH' },
  { code: '3E4X2', title: 'Liquid Fuel Systems Maintenance', exposure: 'HIGH' },
  { code: '3E4X3', title: 'Environmental', exposure: 'MOD' },
  { code: '3E5X1', title: 'Engineering', exposure: 'MOD' },
  { code: '3E6X1', title: 'Operations Management', exposure: 'LOW' },
  { code: '3E8X1', title: 'Explosive Ordnance Disposal', exposure: 'HIGH' },
  { code: '3E9X1', title: 'Readiness', exposure: 'MOD' },

  // Services/Support - varies
  { code: '3M0X1', title: 'Services', exposure: 'MOD' },
  { code: '3N0X1', title: 'Public Affairs', exposure: 'LOW' },
  { code: '3N0X2', title: 'Radio and Television Broadcasting', exposure: 'LOW' },
  { code: '3N2X1', title: 'Premier Band', exposure: 'HIGH' },
  { code: '3P0X1', title: 'Security Forces', exposure: 'HIGH' },
  { code: '3S0X1', title: 'Personnel', exposure: 'LOW' },
  { code: '3S1X1', title: 'Military Equal Opportunity', exposure: 'LOW' },
  { code: '3S2X1', title: 'Education and Training', exposure: 'LOW' },

  // Medical - LOW
  { code: '4A0X1', title: 'Health Services Management', exposure: 'LOW' },
  { code: '4A1X1', title: 'Medical Materiel', exposure: 'LOW' },
  { code: '4A2X1', title: 'Biomedical Equipment', exposure: 'LOW' },
  { code: '4N0X1', title: 'Medical Service', exposure: 'LOW' },
  { code: '4N1X1', title: 'Surgical Service', exposure: 'MOD' },

  // Support - varies
  { code: '5J0X1', title: 'Paralegal', exposure: 'LOW' },
  { code: '5R0X1', title: 'Chaplain Service Support', exposure: 'LOW' },
  { code: '6C0X1', title: 'Contracting', exposure: 'LOW' },
  { code: '6F0X1', title: 'Financial Management & Comptroller', exposure: 'LOW' },
  { code: '7S0X1', title: 'Special Investigations', exposure: 'MOD' },
  { code: '8S000', title: 'Missile Facility Manager', exposure: 'HIGH' },
  { code: '8S100', title: 'Sensor Operator', exposure: 'MOD' },
];

const AIR_FORCE_OFFICER = [
  { code: '11AX', title: 'Airlift Pilot', exposure: 'HIGH' },
  { code: '11BX', title: 'Bomber Pilot', exposure: 'HIGH' },
  { code: '11FX', title: 'Fighter Pilot', exposure: 'HIGH' },
  { code: '11HX', title: 'Helicopter Pilot', exposure: 'HIGH' },
  { code: '11RX', title: 'Reconnaissance/ Surveillance/ Electronic Warfare Pilot', exposure: 'HIGH' },
  { code: '11SX', title: 'Special Operations Pilot', exposure: 'HIGH' },
  { code: '11TX', title: 'Tanker Pilot', exposure: 'HIGH' },
  { code: '12AX', title: 'Airlift Navigator', exposure: 'HIGH' },
  { code: '12BX', title: 'Bomber Navigator', exposure: 'HIGH' },
  { code: '12FX', title: 'Fighter Navigator', exposure: 'HIGH' },
  { code: '12SX', title: 'Special Operations Navigator', exposure: 'HIGH' },
  { code: '13AX', title: 'Astronaut', exposure: 'HIGH' },
  { code: '13BX', title: 'Air Battle Manager', exposure: 'MOD' },
  { code: '13DX', title: 'Combat Control', exposure: 'HIGH' },
  { code: '13MX', title: 'Airfield Operations', exposure: 'MOD' },
  { code: '13SX', title: 'Space & Missile', exposure: 'HIGH' },
  { code: '14NX', title: 'Intelligence', exposure: 'LOW' },
  { code: '31PX', title: 'Security Forces', exposure: 'HIGH' },
  { code: '32EX', title: 'Civil Engineer', exposure: 'HIGH' },
];

const COAST_GUARD = [
  { code: 'AMT', title: 'Aviation Maintenance Technician', exposure: 'HIGH' },
  { code: 'AET', title: 'Aviation Electrical Technician', exposure: 'HIGH' },
  { code: 'AST', title: 'Aviation Survival Technician', exposure: 'HIGH' },
  { code: 'BM', title: 'Boatswain\'s Mate', exposure: 'HIGH' },
  { code: 'DC', title: 'Damage Controlman', exposure: 'HIGH' },
  { code: 'EM', title: 'Electrician\'s Mate', exposure: 'HIGH' },
  { code: 'ET', title: 'Electronics Technician', exposure: 'MOD' },
  { code: 'FS', title: 'Food Service Specialist', exposure: 'MOD' },
  { code: 'GM', title: 'Gunner\'s Mate', exposure: 'HIGH' },
  { code: 'HS', title: 'Health Services', exposure: 'LOW' },
  { code: 'IS', title: 'Intelligence Specialist', exposure: 'LOW' },
  { code: 'IT', title: 'Information Systems Technician', exposure: 'LOW' },
  { code: 'IV', title: 'Investigator', exposure: 'MOD' },
  { code: 'ME', title: 'Maritime Enforcement Specialist', exposure: 'HIGH' },
  { code: 'MK', title: 'Machinery Technician', exposure: 'HIGH' },
  { code: 'MST', title: 'Marine Science Technician', exposure: 'MOD' },
  { code: 'MU', title: 'Musician', exposure: 'HIGH' },
  { code: 'OS', title: 'Operations Specialist', exposure: 'MOD' },
  { code: 'PA', title: 'Public Affairs Specialist', exposure: 'LOW' },
  { code: 'PS', title: 'Port Securityman', exposure: 'HIGH' },
  { code: 'SK', title: 'Storekeeper', exposure: 'LOW' },
  { code: 'YN', title: 'Yeoman', exposure: 'LOW' },
];

const MERCHANT_MARINE = [
  { code: 'BM', title: 'Boatswain\'s Mate', exposure: 'HIGH' },
  { code: 'AS', title: 'Able Seaman', exposure: 'HIGH' },
  { code: 'OS', title: 'Ordinary Seaman', exposure: 'HIGH' },
  { code: 'DECK', title: 'Deck Hands', exposure: 'HIGH' },
  { code: 'ENG', title: 'Engineering Hands', exposure: 'HIGH' },
  { code: 'NAV', title: 'Navigators', exposure: 'MOD' },
];

// Combine all branches into searchable structure
const ALL_BRANCHES = [
  { id: 'army-enlisted', name: 'Army Enlisted', icon: '⭐', data: ARMY_ENLISTED },
  { id: 'army-officer', name: 'Army Officer', icon: '⭐', data: ARMY_OFFICER },
  { id: 'army-warrant', name: 'Army Warrant Officer', icon: '⭐', data: ARMY_WARRANT },
  { id: 'navy', name: 'Navy Enlisted', icon: '⚓', data: NAVY_ENLISTED },
  { id: 'marine-corps', name: 'Marine Corps', icon: '🦅', data: MARINE_CORPS },
  { id: 'air-force-enlisted', name: 'Air Force Enlisted', icon: '✈️', data: AIR_FORCE_ENLISTED },
  { id: 'air-force-officer', name: 'Air Force Officer', icon: '✈️', data: AIR_FORCE_OFFICER },
  { id: 'coast-guard', name: 'Coast Guard', icon: '🚢', data: COAST_GUARD },
  { id: 'merchant-marine', name: 'US Merchant Marine', icon: '🚢', data: MERCHANT_MARINE },
];

// Color coding for exposure levels
const EXPOSURE_COLORS = {
  HIGH: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-300 dark:border-red-700',
    badge: 'bg-red-500 text-white',
    label: 'Highly Probable'
  },
  MOD: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-300 dark:border-yellow-700',
    badge: 'bg-yellow-500 text-white',
    label: 'Moderate'
  },
  LOW: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-300 dark:border-green-700',
    badge: 'bg-green-500 text-white',
    label: 'Low'
  }
};

export default function MOSNoiseExposureLookup() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [expandedBranch, setExpandedBranch] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  // Search across all branches
  const searchResults = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];

    const term = searchTerm.toLowerCase();
    const results = [];

    ALL_BRANCHES.forEach(branch => {
      branch.data.forEach(mos => {
        if (
            mos.code.toLowerCase().includes(term) ||
            mos.title.toLowerCase().includes(term)
        ) {
          results.push({
            ...mos,
            branch: branch.name,
            branchIcon: branch.icon
          });
        }
      });
    });

    return results.slice(0, 50); // Limit results
  }, [searchTerm]);

  // Statistics for current view
  const branchStats = useMemo(() => {
    if (!selectedBranch) return null;

    const branch = ALL_BRANCHES.find(b => b.id === selectedBranch);
    if (!branch) return null;

    const high = branch.data.filter(m => m.exposure === 'HIGH').length;
    const mod = branch.data.filter(m => m.exposure === 'MOD').length;
    const low = branch.data.filter(m => m.exposure === 'LOW').length;

    return { high, mod, low, total: branch.data.length };
  }, [selectedBranch]);

  const handleBack = () => {
    if (selectedBranch) {
      setSelectedBranch(null);
      setExpandedBranch(null);
    } else {
      window.history.back();
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Volume2 className="w-6 h-6 text-orange-500" />
                  MOS Noise Exposure Lookup
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  VA Duty MOS Noise Exposure Listing (March 2022)
                </p>
              </div>
              <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Info className="w-5 h-5 text-blue-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Info Panel */}
          {showInfo && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4 text-left">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  How This Helps Your Claim
                </h3>
                <div className="text-sm text-blue-800 dark:text-blue-300 space-y-2 text-left">
                  <p className="text-left">
                    The VA uses this official listing to determine if your duty position had probable exposure to hazardous noise. When your MOS/AFSC/NEC shows noise exposure, the VA should <strong>concede exposure to hazardous noise</strong> for purposes of establishing an in-service event.
                  </p>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded text-center">
                      <span className="font-bold text-red-700 dark:text-red-300">HIGH</span>
                      <p className="text-xs">Highly Probable</p>
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded text-center">
                      <span className="font-bold text-yellow-700 dark:text-yellow-300">MOD</span>
                      <p className="text-xs">Moderate</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-center">
                      <span className="font-bold text-green-700 dark:text-green-300">LOW</span>
                      <p className="text-xs">Low Probability</p>
                    </div>
                  </div>
                  <p className="mt-3 text-left">
                    <strong>Important:</strong> Even if your MOS is not listed or shows "Low," you can still establish noise exposure through:
                  </p>
                  <ul className="list-disc list-inside ml-2 text-left">
                    <li>Combat service documentation</li>
                    <li>Duty assignment descriptions</li>
                    <li>Buddy statements</li>
                    <li>VBA Form 21-4138 or 21-20210</li>
                  </ul>
                </div>
              </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                placeholder="Search by MOS code or job title (e.g., '11B' or 'Infantry')"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Search Results */}
          {searchTerm.length >= 2 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Search Results ({searchResults.length})
                  </h3>
                </div>
                {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No matching MOS codes found. Try a different search term.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
                      {searchResults.map((result, idx) => (
                          <div
                              key={`${result.code}-${idx}`}
                              className={`p-3 flex items-start justify-between gap-2 ${EXPOSURE_COLORS[result.exposure].bg}`}
                          >
                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex items-center gap-2 text-left">
                                <span>{result.branchIcon}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                          {result.branch}
                        </span>
                              </div>
                              <div className="flex items-start gap-2 mt-1 text-left">
                        <span className="font-mono font-bold text-gray-900 dark:text-white flex-shrink-0">
                          {result.code}
                        </span>
                                <span className="text-gray-700 dark:text-gray-300 text-left break-words">
                          {result.title}
                        </span>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold flex-shrink-0 whitespace-nowrap ${EXPOSURE_COLORS[result.exposure].badge}`}>
                      {EXPOSURE_COLORS[result.exposure].label}
                    </span>
                          </div>
                      ))}
                    </div>
                )}
              </div>
          )}

          {/* Branch Selection (when not searching) */}
          {searchTerm.length < 2 && !selectedBranch && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Select Your Branch
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ALL_BRANCHES.map(branch => (
                      <button
                          key={branch.id}
                          onClick={() => setSelectedBranch(branch.id)}
                          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{branch.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {branch.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {branch.data.length} codes listed
                            </p>
                          </div>
                        </div>
                      </button>
                  ))}
                </div>
              </div>
          )}

          {/* Branch Detail View */}
          {selectedBranch && searchTerm.length < 2 && (
              <div className="space-y-4">
                {/* Stats Bar */}
                {branchStats && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {ALL_BRANCHES.find(b => b.id === selectedBranch)?.icon}{' '}
                          {ALL_BRANCHES.find(b => b.id === selectedBranch)?.name}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                    {branchStats.total} codes
                  </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded">
                          <div className="text-xl font-bold text-red-700 dark:text-red-300">
                            {branchStats.high}
                          </div>
                          <div className="text-xs text-red-600 dark:text-red-400">High</div>
                        </div>
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">
                          <div className="text-xl font-bold text-yellow-700 dark:text-yellow-300">
                            {branchStats.mod}
                          </div>
                          <div className="text-xs text-yellow-600 dark:text-yellow-400">Moderate</div>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
                          <div className="text-xl font-bold text-green-700 dark:text-green-300">
                            {branchStats.low}
                          </div>
                          <div className="text-xs text-green-600 dark:text-green-400">Low</div>
                        </div>
                      </div>
                    </div>
                )}

                {/* MOS List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[60vh] overflow-y-auto">
                    {ALL_BRANCHES.find(b => b.id === selectedBranch)?.data.map((mos, idx) => (
                        <div
                            key={`${mos.code}-${idx}`}
                            className={`p-3 flex items-start justify-between gap-2 ${EXPOSURE_COLORS[mos.exposure].bg}`}
                        >
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-start gap-2 text-left">
                        <span className="font-mono font-bold text-gray-900 dark:text-white flex-shrink-0">
                          {mos.code}
                        </span>
                              <span className="text-gray-700 dark:text-gray-300 text-left break-words">
                          {mos.title}
                        </span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-bold flex-shrink-0 whitespace-nowrap ${EXPOSURE_COLORS[mos.exposure].badge}`}>
                      {EXPOSURE_COLORS[mos.exposure].label}
                    </span>
                        </div>
                    ))}
                  </div>
                </div>
              </div>
          )}

          {/* Legal References */}
          <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 text-sm">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Legal References
            </h4>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              <li>• <strong>38 U.S.C. 1154(a) and (b)</strong> - Consideration of veteran's service</li>
              <li>• <strong>38 CFR 3.304(d)</strong> - Combat veteran presumptions</li>
              <li>• <strong>Reeves v. Shinseki</strong>, 682 F.3d 988 (Fed.Cir. 2012) - Combat service noise exposure</li>
              <li>• <strong>M21-1, Part V, Subpart iii, 2.B.1.d</strong> - Audiometric examinations</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-xs text-amber-800 dark:text-amber-200">
            <strong>Disclaimer:</strong> This tool is based on the VA's Duty MOS Noise Exposure Listing
            (March 2022) and is provided for informational purposes only. The listing is not an exclusive
            means of establishing noise exposure. Veterans should fully explain their duty assignments on
            VBA Form 21-4138 or 21-20210 regardless of whether their MOS appears on this list.
          </div>
        </div>
      </div>
  );
}