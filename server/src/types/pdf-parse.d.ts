declare module 'pdf-parse' {
  type PdfResult = { text: string };
  const pdf: (buffer: Buffer) => Promise<PdfResult>;
  export default pdf;
}
