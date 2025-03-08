/**
 * All viewmodels should implement this interface.
 */
export default interface IBaseVM<VM> {
  useVM(): VM;
}
