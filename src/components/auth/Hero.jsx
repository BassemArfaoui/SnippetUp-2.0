import { FaCode } from "react-icons/fa6";

const Hero = () => {
  return (
    <div className="d-none d-md-flex flex-column align-items-center mt-5 ">
      <div>
        <FaCode className="text-primary" style={{ fontSize: "60px" }} />
      </div>

      <div style={{ fontSize: "40px" }} className="mt-0 fw-bold">
        Join <span className="text-primary fw-bold">SnippetUp</span>
      </div>

      <p className="mt-2 px-5 text-center fw-bold" style={{fontSize:'19px'}}>
        <p className="text-center" style={{maxWidth:'500px'}}>
          The developer's home for sharing, discovering, and collaborating on code
          snippets
        </p>
      </p>
    </div>
  );
};

export default Hero;
