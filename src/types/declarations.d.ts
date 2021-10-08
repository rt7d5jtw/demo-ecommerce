declare module '*.png';
declare module '*.jpg' {
  const fileName: string;
  export default fileName;
}
declare module '*.svg';
