import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge v2 does not know this project's custom text-size tokens
 * (`text-14`, `text-body`, ...), so it treats them as colors and removes the
 * real color class when both are merged. Registering the tokens as font sizes
 * keeps `text-<size>` and `text-<color>` together.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '22',
            '25', '26', '32', '52',
            'h1', 'h2', 'h3', 'h4', 'h5', 'label', 'body', 'caption',
            'eyebrow', 'lead', 'small', 'tiny',
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
