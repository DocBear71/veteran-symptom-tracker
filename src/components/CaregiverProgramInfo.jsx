/**
 * CaregiverProgramInfo.jsx
 *
 * Educational component explaining the VA's Program of Comprehensive
 * Assistance for Family Caregivers (PCAFC) under the MISSION Act.
 *
 * Helps caregivers understand eligibility requirements, benefits,
 * and how to apply for the program.
 *
 * References:
 * - 38 U.S.C. § 1720G
 * - 38 C.F.R. § 71
 * - VA Caregiver Support Program
 */

import { useState } from 'react';
import {
  Heart,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Shield,
  Clock,
  Users,
  FileText,
  ExternalLink,
  Info,
  HelpCircle,
  Home,
  Activity
} from 'lucide-react';

/**
 * PCAFC Program Data
 */
const PCAFC_DATA = {
  overview: {
    name: 'Program of Comprehensive Assistance for Family Caregivers',
    shortName: 'PCAFC',
    administeredBy: 'VA Caregiver Support Program',
    legalBasis: '38 U.S.C. § 1720G, as expanded by the MISSION Act of 2018',
    effectiveDate: 'October 1, 2020 (expanded eligibility)',
    description: 'The PCAFC provides support services and a monthly stipend to family caregivers of eligible veterans who require personal care services due to service-connected conditions.'
  },

  eligibility: {
    veteran: {
      title: 'Veteran Eligibility Requirements',
      requirements: [
        {
          requirement: 'Service-connected disability rating',
          details: 'Must have a serious injury (including traumatic brain injury, psychological trauma, or other mental disorder) incurred or aggravated in the line of duty',
          critical: true
        },
        {
          requirement: 'Need for personal care services',
          details: 'Unable to perform one or more Activities of Daily Living (ADLs) OR requires supervision, protection, or instruction due to neurological or other impairment',
          critical: true
        },
        {
          requirement: 'Duration of need',
          details: 'Requires personal care services for a minimum of 6 continuous months',
          critical: true
        },
        {
          requirement: 'Service era (expanded)',
          details: 'As of October 2022, veterans from ALL eras are eligible (previously limited to post-9/11)',
          critical: false
        },
        {
          requirement: 'Enrolled in VA healthcare',
          details: 'Must be enrolled in VA healthcare OR have an application pending',
          critical: false
        }
      ]
    },
    caregiver: {
      title: 'Caregiver Eligibility Requirements',
      requirements: [
        {
          requirement: 'Age requirement',
          details: 'Must be at least 18 years old',
          critical: true
        },
        {
          requirement: 'Relationship or cohabitation',
          details: 'Must be a family member OR live with the veteran full-time (or willing to do so)',
          critical: true
        },
        {
          requirement: 'No disqualifying conditions',
          details: 'Cannot have physical, mental, or health condition that would interfere with providing care',
          critical: true
        },
        {
          requirement: 'Capable of providing care',
          details: 'Must be able to complete required caregiver training',
          critical: false
        }
      ]
    }
  },

  adlCategories: {
    title: 'Activities of Daily Living (ADLs)',
    description: 'The veteran must need assistance with at least one of these activities:',
    activities: [
      {
        name: 'Dressing',
        icon: '👕',
        description: 'Putting on and taking off clothes, including prosthetics/orthotics',
        examples: ['Cannot button shirts', 'Cannot tie shoes', 'Cannot manage zippers', 'Needs help with prosthetic limb']
      },
      {
        name: 'Bathing',
        icon: '🚿',
        description: 'Washing body, getting in/out of tub or shower',
        examples: ['Cannot safely enter/exit shower', 'Cannot wash all body parts', 'Risk of falling', 'Cannot regulate water temperature']
      },
      {
        name: 'Grooming',
        icon: '🪥',
        description: 'Brushing teeth, shaving, combing hair, nail care',
        examples: ['Cannot hold toothbrush', 'Unsafe with razor', 'Cannot trim nails', 'Cannot comb/brush hair']
      },
      {
        name: 'Toileting',
        icon: '🚽',
        description: 'Getting to toilet, managing clothing, cleaning self',
        examples: ['Cannot get to bathroom in time', 'Cannot manage clothing', 'Cannot clean self', 'Needs help with ostomy care']
      },
      {
        name: 'Feeding/Eating',
        icon: '🍽️',
        description: 'Getting food to mouth, chewing, swallowing',
        examples: ['Cannot use utensils', 'Choking risk', 'Cannot cut food', 'Needs tube feeding assistance']
      },
      {
        name: 'Mobility/Transfers',
        icon: '🚶',
        description: 'Moving in/out of bed, chair, wheelchair; walking',
        examples: ['Cannot get out of bed alone', 'Cannot transfer to wheelchair', 'Fall risk when walking', 'Cannot climb stairs']
      }
    ]
  },

  supervisionNeeds: {
    title: 'Supervision, Protection, or Instruction Needs',
    description: 'Even if the veteran can physically perform ADLs, they may qualify if they need:',
    categories: [
      {
        name: 'Supervision',
        description: 'Monitoring to ensure safety during daily activities',
        examples: ['Cannot be left alone safely', 'May wander due to dementia/TBI', 'Requires prompting to complete tasks']
      },
      {
        name: 'Protection',
        description: 'Protection from hazards due to cognitive or psychological impairment',
        examples: ['Cannot recognize dangerous situations', 'Impulsive behavior due to TBI', 'Self-harm risk due to PTSD/mental health']
      },
      {
        name: 'Instruction',
        description: 'Needs guidance to complete activities due to cognitive impairment',
        examples: ['Forgets steps in daily routines', 'Cannot sequence tasks', 'Needs verbal cues for basic activities']
      }
    ]
  },

  stipendLevels: {
    title: 'Monthly Stipend Levels',
    description: 'Stipend amount is based on the level of care needed and geographic location',
    effectiveDate: 'Rates updated annually',
    levels: [
      {
        level: 'Level 1',
        description: 'Moderate level of personal care services',
        criteria: 'Needs assistance with 1-2 ADLs OR requires supervision for safety',
        stipendRange: 'Approximately $2,000 - $2,500/month',
        note: 'Based on 62.5% of GS-4 Step 1 hourly rate × 10 hours/week'
      },
      {
        level: 'Level 2',
        description: 'Highest level of personal care services',
        criteria: 'Needs assistance with 3+ ADLs OR requires continuous supervision OR has severe functional impairment',
        stipendRange: 'Approximately $3,000 - $4,000/month',
        note: 'Based on 62.5% of GS-4 Step 1 hourly rate × 25+ hours/week'
      }
    ],
    notes: [
      'Actual stipend varies by geographic location (cost of living adjustment)',
      'Primary Family Caregiver receives the full stipend',
      'Secondary Family Caregivers do not receive a stipend but get other benefits',
      'Stipend is calculated based on Bureau of Labor Statistics wage data'
    ]
  },

  benefits: {
    title: 'PCAFC Benefits',
    categories: [
      {
        category: 'Financial Benefits',
        icon: DollarSign,
        color: 'green',
        items: [
          {
            benefit: 'Monthly Stipend',
            description: 'Tax-free monthly payment based on care level',
            forPrimary: true,
            forSecondary: false
          },
          {
            benefit: 'Travel Expenses',
            description: 'Reimbursement for travel to VA appointments with the veteran',
            forPrimary: true,
            forSecondary: true
          }
        ]
      },
      {
        category: 'Healthcare Benefits',
        icon: Shield,
        color: 'blue',
        items: [
          {
            benefit: 'CHAMPVA Coverage',
            description: 'Health insurance through CHAMPVA if not eligible for other coverage',
            forPrimary: true,
            forSecondary: false
          },
          {
            benefit: 'Mental Health Counseling',
            description: 'Access to mental health services for caregiver wellness',
            forPrimary: true,
            forSecondary: true
          }
        ]
      },
      {
        category: 'Support Services',
        icon: Heart,
        color: 'pink',
        items: [
          {
            benefit: 'Respite Care',
            description: 'At least 30 days of respite care per year so caregivers can take breaks',
            forPrimary: true,
            forSecondary: true
          },
          {
            benefit: 'Caregiver Training',
            description: 'Education and training on how to care for the veteran',
            forPrimary: true,
            forSecondary: true
          },
          {
            benefit: 'Peer Support',
            description: 'Connection with other caregivers through support groups',
            forPrimary: true,
            forSecondary: true
          },
          {
            benefit: 'Financial Planning',
            description: 'Access to financial planning services',
            forPrimary: true,
            forSecondary: true
          }
        ]
      }
    ]
  },

  applicationProcess: {
    title: 'How to Apply',
    steps: [
      {
        step: 1,
        title: 'Complete VA Form 10-10CG',
        description: 'Joint application completed by both veteran and caregiver(s)',
        link: 'https://www.va.gov/family-member-benefits/apply-for-caregiver-assistance-form-10-10cg/',
        tips: [
          'Can be submitted online, by mail, or in person',
          'Both veteran and caregiver must sign',
          'Include all requested documentation'
        ]
      },
      {
        step: 2,
        title: 'Clinical Assessment',
        description: 'VA will schedule a home visit or assessment to evaluate needs',
        tips: [
          'Be honest about the veteran\'s worst days',
          'Document all care activities you perform',
          'Have a list of ADLs the veteran needs help with'
        ]
      },
      {
        step: 3,
        title: 'Eligibility Determination',
        description: 'VA will review application and clinical assessment',
        tips: [
          'Process typically takes 45-90 days',
          'You can check status online or by calling',
          'If denied, you have the right to appeal'
        ]
      },
      {
        step: 4,
        title: 'Complete Training',
        description: 'If approved, complete required caregiver training',
        tips: [
          'Training covers core caregiving skills',
          'Additional training available based on veteran\'s needs',
          'Must complete training to receive benefits'
        ]
      }
    ]
  },

  resources: {
    title: 'Helpful Resources',
    links: [
      {
        name: 'VA Caregiver Support Line',
        description: '1-855-260-3274 (Monday-Friday, 8am-8pm ET)',
        url: 'tel:1-855-260-3274',
        type: 'phone'
      },
      {
        name: 'VA Caregiver Support Website',
        description: 'Official program information and resources',
        url: 'https://www.caregiver.va.gov/',
        type: 'website'
      },
      {
        name: 'Apply Online (VA Form 10-10CG)',
        description: 'Submit your application electronically',
        url: 'https://www.va.gov/family-member-benefits/apply-for-caregiver-assistance-form-10-10cg/',
        type: 'form'
      },
      {
        name: 'Find Your Local Caregiver Support Coordinator',
        description: 'Connect with your nearest VA facility',
        url: 'https://www.caregiver.va.gov/support/New_CSC_Page.asp',
        type: 'locator'
      },
      {
        name: 'Elizabeth Dole Foundation',
        description: 'Additional resources for military caregivers',
        url: 'https://www.elizabethdolefoundation.org/',
        type: 'external'
      }
    ]
  }
};

/**
 * Expandable Section Component
 */
const ExpandableSection = ({ title, icon: Icon, color = 'blue', defaultExpanded = false, children }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const colorClasses = {
    blue: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
    green: 'border-green-500 bg-green-50 dark:bg-green-900/20',
    purple: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
    amber: 'border-amber-500 bg-amber-50 dark:bg-amber-900/20',
    pink: 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
  };

  return (
      <div className={`rounded-lg border-l-4 overflow-hidden ${colorClasses[color]}`}>
        <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
            <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
          </div>
          {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {expanded && (
            <div className="px-4 pb-4 bg-white dark:bg-gray-800">
              {children}
            </div>
        )}
      </div>
  );
};

/**
 * ADL Card Component
 */
const ADLCard = ({ activity }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{activity.icon}</span>
        <span className="font-medium text-gray-900 dark:text-white">{activity.name}</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{activity.description}</p>
      <div className="text-xs text-gray-500 dark:text-gray-500">
        <strong>Examples:</strong> {activity.examples.join(', ')}
      </div>
    </div>
);

/**
 * Stipend Level Card Component
 */
const StipendLevelCard = ({ level }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg text-gray-900 dark:text-white">{level.level}</span>
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
        {level.stipendRange}
      </span>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{level.description}</p>
      <p className="text-sm text-blue-700 dark:text-blue-400">
        <strong>Criteria:</strong> {level.criteria}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">{level.note}</p>
    </div>
);

/**
 * Main PCAFC Component
 */
const CaregiverProgramInfo = () => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-800 dark:to-purple-800 rounded-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">{PCAFC_DATA.overview.shortName}</h2>
              <p className="text-pink-100 text-sm">{PCAFC_DATA.overview.name}</p>
            </div>
          </div>
          <p className="text-pink-100 dark:text-pink-200 mt-3">
            {PCAFC_DATA.overview.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
            {PCAFC_DATA.overview.legalBasis}
          </span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: Info },
            { id: 'eligibility', label: 'Eligibility', icon: CheckCircle },
            { id: 'adls', label: 'ADLs', icon: Activity },
            { id: 'benefits', label: 'Benefits', icon: DollarSign },
            { id: 'apply', label: 'How to Apply', icon: FileText },
          ].map(nav => {
            const Icon = nav.icon;
            return (
                <button
                    key={nav.id}
                    onClick={() => setActiveSection(nav.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeSection === nav.id
                            ? 'bg-pink-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {nav.label}
                </button>
            );
          })}
        </div>

        {/* Content Sections */}
        <div className="space-y-4">

          {/* Overview Section */}
          {activeSection === 'overview' && (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    What is PCAFC?
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    The Program of Comprehensive Assistance for Family Caregivers supports family members
                    who provide care to veterans with service-connected conditions. Caregivers may receive
                    a monthly stipend, health insurance, respite care, and other support services.
                  </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                  <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Recent Expansion (October 2022)
                  </h3>
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    PCAFC was previously limited to post-9/11 veterans, but is now available to veterans
                    from <strong>ALL service eras</strong>. If you were previously denied due to service era,
                    you may now be eligible to apply.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                    <Users className="w-6 h-6 text-pink-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600 dark:text-gray-400">Primary & Secondary</div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">Caregivers</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                    <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600 dark:text-gray-400">Tax-Free</div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">Monthly Stipend</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                    <Shield className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600 dark:text-gray-400">CHAMPVA</div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">Health Coverage</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
                    <Clock className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600 dark:text-gray-400">30+ Days/Year</div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">Respite Care</div>
                  </div>
                </div>
              </>
          )}

          {/* Eligibility Section */}
          {activeSection === 'eligibility' && (
              <>
                <ExpandableSection
                    title={PCAFC_DATA.eligibility.veteran.title}
                    icon={Users}
                    color="blue"
                    defaultExpanded={true}
                >
                  <div className="space-y-2 mt-3">
                    {PCAFC_DATA.eligibility.veteran.requirements.map((req, idx) => (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg ${
                                req.critical
                                    ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                    : 'bg-gray-50 dark:bg-gray-700/50'
                            }`}
                        >
                          <div className="flex items-start gap-2">
                            {req.critical ? (
                                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            ) : (
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            )}
                            <div>
                              <div className={`font-medium ${
                                  req.critical ? 'text-red-900 dark:text-red-200' : 'text-gray-900 dark:text-white'
                              }`}>
                                {req.requirement}
                                {req.critical && <span className="ml-2 text-xs text-red-600 dark:text-red-400">(Required)</span>}
                              </div>
                              <p className={`text-sm mt-1 ${
                                  req.critical ? 'text-red-700 dark:text-red-300' : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {req.details}
                              </p>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </ExpandableSection>

                <ExpandableSection
                    title={PCAFC_DATA.eligibility.caregiver.title}
                    icon={Heart}
                    color="pink"
                    defaultExpanded={true}
                >
                  <div className="space-y-2 mt-3">
                    {PCAFC_DATA.eligibility.caregiver.requirements.map((req, idx) => (
                        <div
                            key={idx}
                            className={`p-3 rounded-lg ${
                                req.critical
                                    ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                    : 'bg-gray-50 dark:bg-gray-700/50'
                            }`}
                        >
                          <div className="flex items-start gap-2">
                            {req.critical ? (
                                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            ) : (
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            )}
                            <div>
                              <div className={`font-medium ${
                                  req.critical ? 'text-red-900 dark:text-red-200' : 'text-gray-900 dark:text-white'
                              }`}>
                                {req.requirement}
                              </div>
                              <p className={`text-sm mt-1 ${
                                  req.critical ? 'text-red-700 dark:text-red-300' : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {req.details}
                              </p>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </ExpandableSection>
              </>
          )}

          {/* ADLs Section */}
          {activeSection === 'adls' && (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    {PCAFC_DATA.adlCategories.title}
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    {PCAFC_DATA.adlCategories.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PCAFC_DATA.adlCategories.activities.map((activity, idx) => (
                      <ADLCard key={idx} activity={activity} />
                  ))}
                </div>

                <ExpandableSection
                    title={PCAFC_DATA.supervisionNeeds.title}
                    icon={HelpCircle}
                    color="purple"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 mb-3">
                    {PCAFC_DATA.supervisionNeeds.description}
                  </p>
                  <div className="space-y-3">
                    {PCAFC_DATA.supervisionNeeds.categories.map((cat, idx) => (
                        <div key={idx} className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                          <div className="font-medium text-purple-900 dark:text-purple-200">{cat.name}</div>
                          <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">{cat.description}</p>
                          <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                            <strong>Examples:</strong> {cat.examples.join('; ')}
                          </p>
                        </div>
                    ))}
                  </div>
                </ExpandableSection>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Track ADLs in This App
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-300">
                    Use the ADL tracking features in this app to document limitations. This documentation
                    can support your PCAFC application by showing consistent patterns of care needs.
                  </p>
                </div>
              </>
          )}

          {/* Benefits Section */}
          {activeSection === 'benefits' && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {PCAFC_DATA.stipendLevels.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {PCAFC_DATA.stipendLevels.description}
                  </p>

                  <div className="space-y-3">
                    {PCAFC_DATA.stipendLevels.levels.map((level, idx) => (
                        <StipendLevelCard key={idx} level={level} />
                    ))}
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                    <h4 className="font-medium text-amber-900 dark:text-amber-200 mb-2">Important Notes:</h4>
                    <ul className="space-y-1">
                      {PCAFC_DATA.stipendLevels.notes.map((note, idx) => (
                          <li key={idx} className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            {note}
                          </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">All Benefits</h3>
                  {PCAFC_DATA.benefits.categories.map((category, idx) => {
                    const Icon = category.icon;
                    return (
                        <ExpandableSection
                            key={idx}
                            title={category.category}
                            icon={Icon}
                            color={category.color}
                        >
                          <div className="space-y-2 mt-3">
                            {category.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-900 dark:text-white">{item.benefit}</span>
                                    <div className="flex gap-1">
                                      {item.forPrimary && (
                                          <span className="px-2 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-xs rounded">
                                  Primary
                                </span>
                                      )}
                                      {item.forSecondary && (
                                          <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded">
                                  Secondary
                                </span>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                                </div>
                            ))}
                          </div>
                        </ExpandableSection>
                    );
                  })}
                </div>
              </>
          )}

          {/* Apply Section */}
          {activeSection === 'apply' && (
              <>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {PCAFC_DATA.applicationProcess.title}
                  </h3>

                  {PCAFC_DATA.applicationProcess.steps.map((step, idx) => (
                      <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">
                            {step.step}
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{step.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{step.description}</p>

                        {step.link && (
                            <a
                                href={step.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-pink-600 dark:text-pink-400 hover:underline mb-3"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Apply Online
                            </a>
                        )}

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-2">
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tips:</div>
                          <ul className="space-y-1">
                            {step.tips.map((tip, tipIdx) => (
                                <li key={tipIdx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                  <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                                  {tip}
                                </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                  ))}
                </div>

                {/* Resources */}
                <div className="space-y-3 mt-6">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {PCAFC_DATA.resources.title}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PCAFC_DATA.resources.links.map((resource, idx) => (
                        <a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-sm">{resource.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{resource.description}</div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </a>
                    ))}
                  </div>
                </div>
              </>
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 text-xs text-gray-600 dark:text-gray-400">
          <strong>Disclaimer:</strong> This information is for educational purposes only and does not
          constitute legal or medical advice. Program requirements and benefits may change.
          Contact the VA Caregiver Support Line at 1-855-260-3274 for the most current information
          and assistance with your application.
        </div>
      </div>
  );
};

export default CaregiverProgramInfo;