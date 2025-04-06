export interface HtmlParser<T> {
  parse(html: string): T;
}
