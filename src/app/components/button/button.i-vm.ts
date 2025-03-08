/**
 * Interface for viewmodel of button. this is bridge between view and viewmodel.
 * With this interface, view is adapter and vms will be implementations in bridge pattern
 */
export default interface ButtonVm {
  props: {
    title: string;
    isDisable: boolean;
  };
  onClick(): void;
}
