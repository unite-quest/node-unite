export default interface DashboardResponseActionDto {
  themeId: string;
  title: string;
  type: 'REGISTER' | 'RECORDING' | 'EXTRA';
  points: number;
  isRecording: boolean;
  background: {
    src: string;
    alt: string;
  };
  banner?: {
    title: string;
    src: string;
    alt: string;
  };
}
