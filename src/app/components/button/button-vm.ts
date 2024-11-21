export default interface ButtonVm {
  props: {
    title: string;
    isDisable: boolean;
  };
  onClick(): void;
}
