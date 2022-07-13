
/// <amd-dependency path="jszip" name="JSZip"/>
declare var JSZip;

JSZip.support.nodebuffer = undefined;//we hacked window.Buffer
export default JSZip;
