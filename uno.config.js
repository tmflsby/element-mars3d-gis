import {
  transformerVariantGroup,
  transformerDirectives,
  presetAttributify,
  presetMini,
  presetUno
} from 'unocss'
import { defineUsefulConfig } from 'unocss-preset-useful'
import layoutJSON from './public/config/layout.json'

const safelist = []
layoutJSON.routes.forEach((route) => {
  route.panels.forEach((panel) => {
    const widget = panel.widget
    if (panel.class) {
      safelist.push(panel.class)
    }
    if (widget.class) {
      safelist.push(widget.class)
    }
    if (widget.subWidgets) {
      widget.subWidgets.forEach((subWidget) => {
        if (subWidget.class) {
          safelist.push(subWidget.class)
        }
      })
    }
  })
})

// https://github.com/unocss/unocss#readme
export default defineUsefulConfig(
  {
    important: true
  },
  {
    safelist,
    presets: [
      presetMini({ dark: 'class' }),
      // https://unocss.dev/presets/attributify#properties-conflicts
      presetAttributify({ prefix: 'un-', prefixedOnly: true }),
      presetUno()
    ],
    transformers: [transformerDirectives(), transformerVariantGroup()],
    rules: [
      [
        /^m-(\w+)-(\w+)-(\w+)-(\w+)$/,
        (match) => ({ margin: `${match[1]} ${match[2]} ${match[3]} ${match[4]}` })
      ],
      [
        /^p-(\w+)-(\w+)-(\w+)-(\w+)$/,
        (match) => ({ padding: `${match[1]} ${match[2]} ${match[3]} ${match[4]}` })
      ]
    ],
    shortcuts: {
      'flex-ac': 'flex justify-around items-center',
      'flex-bc': 'flex justify-between items-center',
      'flex-cc': 'flex justify-center items-center',
      'flex-sc': 'flex justify-start items-center',
      'flex-ec': 'flex justify-end items-center'
    },
    theme: {}
  }
)
