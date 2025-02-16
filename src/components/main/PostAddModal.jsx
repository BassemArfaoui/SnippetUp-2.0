import { useState , useContext } from "react";
import { notify, successNotify } from "../tools/CustomToaster";
import { Modal , Box , IconButton } from "@mui/material";
import CustomTooltip from "../tools/CustomTooltip";
import CloseIcon from '@mui/icons-material/Close';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import SpinnerSpan from '../tools/SpinnerSpan'
import api from "../tools/api";
import {useNavigate} from 'react-router-dom'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './styles/add-modal.css'
import userContext from "../contexts/userContext";



function PostAddModal({openAddModel,closeAddModal,isAddModalOpen , stage , setStage}) {
  const { user } = useContext(userContext);
  const username = user.username ; 

   const navigate = useNavigate();

    const [addData, setAddData] = useState({
      title: "",
      content: "",
      language: "",
    });

    const [optionalData, setOptionalData] = useState({
      description: "",
      gitHubLink: "",
    });

    const [loading, setLoading ]= useState(false)


;






    const handleAddSubmit =async () =>
    {
      if(addData.title.trim() && addData.content.trim() && addData.language.trim())
      {
        try{
          setLoading(true)
          await api.post(`/add-post`,
          {
            ...addData , 
            ...optionalData
          })

          setAddData({
            title: "",
            content: "",
            language: "",
          })

          setOptionalData({
            description: "",
            gitHubLink: "",
          })

          setLoading(false)
          closeAddModal();
          navigate(`/${username}`);
          successNotify('Post Published Successfully')
        }
        catch(err)
        {
          notify('Something Went Wrong')
          setLoading(false)
          setStage(1)
        }
      }else{
        notify('All fields are required')
      }
    }
  
  
    const handleAddChange=(e)=>
    {
      const {name,value}=e.target;
      setAddData(prevData=>({
        ...prevData,
        [name]:value
      }))
    }

    const nextStage = () =>
    {
      if(addData.title.trim() && addData.content.trim() && addData.language.trim())
      {
        setStage(2)
      }else{
        notify('All fields are required')
      }
    }


    const handleOptionalDataChange = (e) => {
      const { name, value } = e.target;
      setOptionalData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  






  return (
    <div>
      <Modal
        open={isAddModalOpen}
        onClose={closeAddModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "16px",
            maxHeight: "90vh",
            overflowY: "auto",
            width: "75%",
            backgroundColor: "#1E1E1E",
            color: "white",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={closeAddModal}
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "white",
            }}
          >
            <CloseIcon className="fs-2" />
          </IconButton>

          {stage === 1 ? (
            <h2 id="modal-title" className="fw-bold mb-4 fs-3 text-center">
              Publish a Post
            </h2>
          ) : (
            <h2
              id="modal-title"
              className="fw-bold text-light fs-3 mb-4 text-center"
            >
              Add Extra Infos{" "}
              <span className="small" style={{ color: "rgb(153, 143, 143)" }}>
                (Optional)
              </span>
            </h2>
          )}

          {stage === 1 ? (
            <div className="filters-buttons h-75 w-100 d-flex flex-column justify-content-center align-items-center mt-3 px-4">
              <form action="" method="POST" className="w-100">
                <div className="d-flex flex-column gap-3 ">
                  <div className="d-flex flex-column flex-md-row gap-3">
                    <input
                      className="filter-input form-control bg-transparent"
                      placeholder="Title"
                      name="title"
                      value={addData.title}
                      onChange={handleAddChange}
                      spellCheck="false"
                      autoComplete="off"
                    />
                    <input
                      className="filter-input form-control bg-transparent"
                      placeholder="Language"
                      name="language"
                      value={addData.language}
                      spellCheck="false"
                      onChange={handleAddChange}
                    />
                  </div>
                  <textarea
                    className="centered-placeholder filter-input form-control bg-transparent"
                    placeholder="Content"
                    name="content"
                    onChange={handleAddChange}
                    value={addData.content}
                    style={{ height: "200px" }}
                    autoComplete="off"
                    spellCheck="false"
                  ></textarea>
                </div>
              </form>
            </div>
          ) : (
            <div className="filters-buttons h-75 w-100 d-flex flex-column justify-content-center align-items-center mt-3 px-4">
              <form action="" method="POST" className="w-100 mt-2">
                <div className="d-flex flex-column gap-3 ">
                  <input
                    className="filter-input form-control bg-transparent w-100"
                    placeholder="Github Link"
                    name="gitHubLink"
                    value={optionalData.gitHubLink}
                    onChange={handleOptionalDataChange}
                    spellCheck="false"
                  />

                  <div className="mt-0 mb-0">
                    <span
                      className="fw-bold ms-2"
                      style={{ color: "rgb(153, 143, 143)", fontSize: "21px" }}
                    >
                      Description :
                    </span>
                  </div>

                  <textarea
                    className="filter-input form-control bg-transparent mt-0"
                    onChange={handleOptionalDataChange}
                    value={optionalData.description}
                    name="description"
                    style={{ height: "200px" }}
                    spellCheck="false"
                  ></textarea>
                </div>
              </form>
            </div>
          )}

          {stage === 1 ? (
            <div className="d-flex justify-content-center mt-5">
              <CustomTooltip title="Next Stage" placement="top">
                <IconButton
                  className="mx-4 mt-0 bg-warning"
                  style={{ backgroundColor: "#f8f9fa" }}
                  onClick={nextStage}
                >
                  <ArrowForwardIcon
                    fontSize="large"
                    className="text-dark fw-bolder"
                  />
                </IconButton>
              </CustomTooltip>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-center mt-5 gap-3">
              
              <CustomTooltip title='Previous Stage'  placement="top">
                <IconButton
                    className="mx-2 mt-0 bg-muted"
                    style={{ backgroundColor: "#f8f9fa" }}
                    onClick={()=>{if(!loading) setStage(1)}}
                    disabled={loading}
                  >
                    
                      <ArrowBackIcon
                        fontSize="large"
                        className="text-dark fw-bolder"
                      />
                    
                  </IconButton>
                </CustomTooltip>

                <CustomTooltip title="Publish" placement="top">
                  <IconButton
                    className="mx-2 mt-0 bg-warning"
                    style={{ backgroundColor: "#f8f9fa" }}
                    onClick={handleAddSubmit}
                  >
                    {!loading ? (
                      <DoneRoundedIcon
                        fontSize="large"
                        className="text-dark fw-bolder"
                      />
                    ) : (
                      <SpinnerSpan/>
                    )}
                  </IconButton>
                </CustomTooltip>

              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}

export default PostAddModal;
