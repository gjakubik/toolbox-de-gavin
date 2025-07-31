import StringTemplater from '@/pages/Tools/StringTemplater'
import Spinner from '@/pages/Tools/Spinner'
import TimezoneConverter from '@/pages/Tools/TimeZoneConverter/TimezoneConverter'
import CronParser from '@/pages/Tools/CronParser'
import CSVPhoneNumberRowDuplicator from '@/pages/Tools/CSVPhoneNumberRowDuplicator'
import CSVDeduper from '@/pages/Tools/CSVDeduper'
import RegexExtractor from '@/pages/Tools/RegexExtractor'
import BracketRemover from '@/pages/Tools/BracketRemover'

const tools = [
  {
    id: 'bracket-remover',
    name: 'Bracket Text Remover',
    description:
      'Remove all text within square brackets [.*] from each line',
    Component: BracketRemover,
  },
  {
    id: 'regex-extractor',
    name: 'Regex Extractor',
    description:
      'Extract text after regex matches from each line of a text block',
    Component: RegexExtractor,
  },
  {
    id: 'string-templater',
    name: 'String Templater',
    description:
      'Save a prefix and/or suffix and copy their result with any input',
    Component: StringTemplater,
  },
  {
    id: 'spinner',
    name: 'Spinner',
    description:
      'Spin a wheel with customizable options to make random selections',
    Component: Spinner,
  },
  {
    id: 'timezone-converter',
    name: 'Timezone Converter',
    description:
      'Convert dates between different timezones with a default to EST',
    Component: TimezoneConverter,
  },
  {
    id: 'cron-parser',
    name: 'Cron Parser',
    description:
      'Parse and explain cron expressions with a detailed breakdown of each field',
    Component: CronParser,
  },
  {
    id: 'csv-phone-number-row-duplicator',
    name: 'CSV Phone Number Row Duplicator',
    description:
      'Clean customer CSV files by expanding rows with multiple phone numbers into separate records',
    Component: CSVPhoneNumberRowDuplicator,
  },
  {
    id: 'csv-deduper',
    name: 'CSV Deduper',
    description:
      'Remove duplicate rows from CSV files based on a selected column while keeping the first occurrence',
    Component: CSVDeduper,
  },
]

export default tools
