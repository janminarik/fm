export const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);
export const toUpperCase = (text: string) => text.toUpperCase();
export const toLowerCase = (text: string) => text.toLowerCase();

// const { t } = useTranslation();

// <div>
// <p>{capitalize(t('greeting'))}</p> {/* Out: "Hello world" */}
// <p>{toUpperCase(t('greeting'))}</p> {/* Out: "HELLO WORLD" */}
// <p>{toLowerCase(t('greeting'))}</p> {/* Out: "hello world" */}
// </div>
