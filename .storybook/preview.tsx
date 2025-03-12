import React from "react";
import { themes } from '@storybook/theming';
import { ThemeProvider } from "../src/app/[lang]/dashboard/components/client/theme-provider/theme-provider";
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import { getI18n, LANGS } from "../src/bootstrap/i18n/i18n"
import { addons } from '@storybook/preview-api';
import { i18n } from "i18next";
import { I18nextProvider } from "react-i18next";
const channel = addons.getChannel();
import "../src/app/globals.css"

/**
 *
 * This function will expand the object with nested properties
 * @param obj refrence Object to that
 * @param leftKeys keys to be nested object keys
 * @param value value to be nested
 *
 */
export const recursiveNestedProps = (
  obj: Record<string, unknown>,
  leftKeys: string[],
  value: unknown,
): Record<string, unknown> => {
  if (leftKeys.length <= 0) return obj;
  if (leftKeys.length === 1) {
    // eslint-disable-next-line no-param-reassign
    obj[leftKeys[0]] = value;
    return obj;
  }
  const key = leftKeys.shift();
  if (!key) return obj;

  if (!obj[key]) {
    // eslint-disable-next-line no-param-reassign
    obj[key] = {};
  }

  return recursiveNestedProps(
    obj[key] as Record<string, unknown>,
    leftKeys,
    value,
  );
};

const preview = {
    decorators: [
    (Story, data) => {
      const [isDark, setDark] = React.useState(true);
      const [i18n, setI18n] = React.useState<i18n>()
      const parsedProps = {} as Record<string, unknown>;
      const { locale } = data.globals
      const props = data.allArgs;
      Object.entries(props).forEach((prop) => {
        const [key, value] = prop;
        if (!key.includes("vm")) {
          parsedProps[key] = value;
          return;
        }
        const splitedKey = key.split(".");

        recursiveNestedProps(parsedProps, splitedKey, value);
      });


      React.useEffect(() => {
        channel.on(DARK_MODE_EVENT_NAME, setDark);
        return () => channel.removeListener(DARK_MODE_EVENT_NAME, setDark);
      }, [channel, setDark]);

      React.useEffect(() => {
        (async () => {
          setI18n((await getI18n({ lng: locale })).i18n);
        })()
      }, [])

      React.useEffect(() => {
          i18n?.changeLanguage(locale);
      }, [locale]);

      return (
        <ThemeProvider
          attribute="class"
          forcedTheme={isDark ? "dark" : "light"}
          enableSystem
          disableTransitionOnChange
       >
        {
          i18n && (
            <I18nextProvider 
              i18n={i18n}
              >
              <Story parsedProps={parsedProps} />
            </I18nextProvider>
          )
        }
       </ThemeProvider> 
      );
    },
  ],
  darkMode: {
    // Override the default dark theme
    dark: { ...themes.dark, appBg: 'black' },
    // Override the default light theme
    classTarget: 'html',
    light: { ...themes.normal, appBg: 'red' },
  },
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  globalTypes: {
    locale: {
      name: 'Locale',
      description: 'Internationalization locale',
      toolbar: {
        icon: 'globe',
        items: [
          { value: LANGS.EN, title: 'English' },
          { value: LANGS.RU, title: 'Russian' },
        ],
        showName: true,
      },
    },
  }
};

export default preview;
