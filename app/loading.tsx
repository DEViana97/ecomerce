import Image from "next/image";
import loader from "./assets/loader.gif";
const Loading = () => {
  return (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh', width: '100dvw' }}>
    <Image
      src={loader}
      alt="Loading..."
      width={150}
      height={150}
    />
  </div>);
}

export default Loading;