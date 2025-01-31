import { FaCode } from "react-icons/fa6";
import illustration from '../../utils/svg/programmer.svg'

const Hero = () => {
  return (
    <div className="d-none d-md-flex flex-column align-items-center ">
      <div>
        <FaCode className="text-primary" style={{ fontSize: "55px" }} />
      </div>

      <div style={{ fontSize: "35px" }} className="mt-0 fw-bold">
        Join <span className="text-primary fw-bold">SnippetUp</span>
      </div>

      <span className="mt-2 px-3 text-center fw-bold" style={{fontSize:'19px'}}>
        <p className="text-center text-dark" style={{maxWidth:'400px'}}>
          The developer's home for sharing, discovering, and collaborating on code
          snippets
        </p>
      </span>
      <img src={illustration} alt="illustration" style={{width:'260px'}}/>      
    </div>
  );
};

export default Hero;
