/* eslint-disable no-unused-vars */
import Button from '../../components/ui/Button';
import Modal, { Backdrop } from '../../components/ui/Modal';

import successIcon from '../../assets/dashboardImageDetails/success-icon.webp';
import warningIcon from '../../assets/dashboardImageDetails/warning-icon.webp';
import closeIcon from '../../assets/dashboardImageDetails/close-icon.webp';
import saveIcon from '../../assets/dashboardImageDetails/download-icon.webp';
import trashIcon from '../../assets/dashboardImageDetails/trash-icon.webp';
import customer from '../../assets/customer.webp';

import { useContext, useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import axios from 'axios';
import { notifyError } from '../../utils/notify';

const BatchDetails = () => {
  const param = useParams();
  const [imageDets, setImageDets] = useState({ loading: false, tags: null });
  const [buttonDropdown, setButtonDropdown] = useState(false);
  const { user } = useContext(UserContext);
  const deleteBatch = async () => {
    try {
      const response = await axios.delete(
        `batch-service/delete/${param.batchId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${user.Token}`,
          },
        }
      );
      if (response) {
        navigate(-1);
      }
    } catch (error) {
      if (error.response.status === 400) {
        notifyError('Please try again, an error occured');
      } else if (error.response.data.message) {
        notifyError(error.response.data.message);
      } else if (error.response.status === 401) {
        notifyError('!Unauthorized, please log out and log in again');
      } else if (error.response.status === 500) {
        notifyError(
          'We are currently experiencing server issues, please try again later'
        );
      } else if (error.response.status === 404) {
        notifyError('Page not found');
      } else {
        notifyError('An error occured!!!');
      }
    } finally {
      /* empty */
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setImageDets((prev) => {
          return {
            ...prev,
            loading: true,
          };
        });

        const response = await axios.get(
          `batch-service/images/${param.batchId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${user.Token}`,
            },
          }
        );

        if (response) {
          setImageDets((prev) => {
            return {
              ...prev,
              loading: false,
              data: response.data.filter((item) => {
                return !item.untagged;
              }),
              untaggedData: response.data.filter((item) => {
                return item.untagged;
              }),
            };
          });
          // console.log(
          //   response.data.filter((item) => {
          //     return !item.untagged;
          //   })
          // );
        }
      } catch (error) {
        if (error.response.status === 400) {
          notifyError('Please try again, an error occured');
        } else if (error.response.data.message) {
          notifyError(error.response.data.message);
        } else if (error.response.status === 401) {
          notifyError('!Unauthorized, please log out and log in again');
        } else if (error.response.status === 500) {
          notifyError(
            'We are currently experiencing server issues, please try again later'
          );
        } else if (error.response.status === 404) {
          notifyError('Page not found');
        } else {
          notifyError('An error occured!!!');
        }
      } finally {
        /* empty */
      }
    };
    fetchData();
  }, [user]);
  const TAG_LIST = [
    { title: 'Water', percentage: '55%' },
    { title: 'Trees', percentage: '30%' },
    { title: 'Cloth', percentage: '20%' },
    { title: 'Sky', percentage: '10%' },
  ];

  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showSaveSuccessModal, setShowSaveSuccessModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // const questionInputRef = useRef();

  const toggleDeleteModal = () => {
    setShowDeleteModal((prev) => !prev);
  };

  const toggleDeleteSuccessModal = () => {
    showDeleteModal && toggleDeleteModal();
    setShowDeleteSuccessModal((prev) => !prev);
  };

  const toggleSaveSuccessModal = () => {
    setShowSaveSuccessModal((prev) => !prev);
  };

  const toggleShowMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const saveToJsonHandler = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify({ ...imageDets.data })
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'data.json';
    link.click();
    setButtonDropdown(false);
    setShowSaveSuccessModal(true);
  };
  const saveToCsvHandler = () => {
    const url = `https://discripto.hng.tech/api1/api/v1/batch-service/download/${param.batchId}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.csv';
    link.click();
    setButtonDropdown(false);
    setShowSaveSuccessModal(true);
  };

  return (
    <main className="dashboard_details">
      <section className="relative flex justify-between items-center">
        <div className="flex items-center gap-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="mb-1 cursor-pointer"
            onClick={() => {
              navigate('/images');
            }}
          >
            <path
              d="M15.0038 19.9201L8.48375 13.4001C7.71375 12.6301 7.71375 11.3701 8.48375 10.6001L15.0038 4.08008"
              stroke="#1D1D1D"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <h2 className="font-bold text-2xl">Batches Details</h2>
        </div>

        <div className="hidden gap-4 lg:flex">
          <div className="relative">
            <Button
              className="bg-[#ff6c00] text-white p-4 w-40 rounded-lg font-medium hover:bg-[#FF9D55]"
              text="Save"
              onclick={() => setButtonDropdown((prev) => !prev)}
            />
            {buttonDropdown && (
              <div
                className="absolute border rounded-lg overflow-hidden w-40 shadow-lg text-center"
                // onClick={() => setButtonDropdown((prev) => !prev)}
              >
                <div
                  className="bg-white text-[#ff6c00] font-medium p-3 hover:bg-[#FF9D55] hover:text-white cursor-pointer"
                  onClick={saveToJsonHandler}
                >
                  Json
                </div>
                <div
                  className="bg-white text-[#ff6c00] p-3 font-medium hover:bg-[#FF9D55] hover:text-white cursor-pointer"
                  onClick={saveToCsvHandler}
                >
                  Download CSV
                </div>
              </div>
            )}
          </div>
          <Button
            className="border border-[#ff6c00] text-[#ff6c00] py-4 px-8 w-40 rounded-lg font-medium	hover:bg-[#FF6C00] hover:text-white"
            text="Delete"
            onclick={toggleDeleteModal}
          />
        </div>
        <div className="lg:hidden md:mr-14" onClick={toggleShowMenu}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {showMenu && (
          <>
            <Backdrop onClick={toggleShowMenu} />
            <div className="absolute bg-white top-10 right-0 z-[100] p-2 w-[18rem]">
              <div
                onClick={() => {
                  saveToJsonHandler();
                  toggleShowMenu();
                }}
                className="p-4 flex items-center gap-4 cursor-pointer justify-between"
              >
                <span className="">Save as Json</span>
                <img src={saveIcon} className="" alt="save icon" />
              </div>
              <div
                onClick={() => {
                  saveToCsvHandler();
                  toggleShowMenu();
                }}
                className="p-4 flex items-center gap-4 cursor-pointer justify-between"
              >
                <span className="">Download CSV</span>
                <img src={saveIcon} className="" alt="save icon" />
              </div>
              <div
                onClick={() => {
                  toggleShowMenu();
                  toggleDeleteModal();
                }}
                className="p-4 border-t text-[#f04438] cursor-pointer flex items-center justify-between gap-4"
              >
                <span className="">Delete</span>
                <img src={trashIcon} alt="delete icon" />
              </div>
            </div>
          </>
        )}
      </section>
      <section className="image_categories">
        {imageDets.data
          ? imageDets.data.map((item, index) => {
              return (
                <div key={index} className="categories">
                  <h3 className="tag">{Object.keys(item)[0]}</h3>
                  <div className="batch_images">
                    {Object.values(item)[0].map((item) => {
                      return (
                        <div className="batch_image" key={item}>
                          <img src={item} alt="" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          : null}
      </section>
      <section>
        {imageDets.data
          ? imageDets.untaggedData.map((item, index) => {
              return (
                <div key={index} className="">
                  <h3 className="tag">{Object.keys(item)[0]}</h3>
                  <div className="batch_images">
                    {Object.values(item)[0].map((item) => {
                      return (
                        <div className="batch_image" key={item}>
                          <img src={item} alt="" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          : null}
      </section>
      {showDeleteModal && (
        <>
          <Backdrop />
          <Modal>
            <div className="flex flex-col items-center justify-center gap-8 p-4">
              <img className="" src={warningIcon} alt="warning icon" />

              <h2 className="text-xl font-[500]">Delete Image</h2>

              <p className="text-[#797b89] text-center text-md">
                Are you sure you want to delete this image? This action cannot
                be undone.
              </p>

              <div className="flex gap-4 mt-4 w-full">
                <Button
                  className="border border-[#8e8e8e] text-8e8e8e py-3 px-6 w-full rounded-lg	font-medium hover:bg-[#FF6C00] hover:text-white"
                  text="Cancel"
                  onclick={toggleDeleteModal}
                />

                <Button
                  className="bg-[#f04438] text-white py-3 px-6 w-full rounded-lg	font-medium hover:bg-[#FF6C00]"
                  text="Delete"
                  onclick={() => {
                    toggleDeleteSuccessModal();
                    deleteBatch();
                  }}
                />
              </div>
            </div>
          </Modal>
        </>
      )}

      {showDeleteSuccessModal && (
        <>
          <Backdrop />
          <Modal>
            <div className=" flex flex-col items-center justify-center gap-8 p-2">
              <div className="flex w-full justify-end">
                <div
                  className="w-10 cursor-pointer"
                  onClick={toggleDeleteSuccessModal}
                >
                  <img className="w-full" src={closeIcon} alt="close icon" />
                </div>
              </div>

              <img className="" src={successIcon} alt="success icon" />

              <h2 className="text-xl font-[500]">Successful</h2>

              <p className="text-[#797b89] text-center text-md">
                Image successfully deleted
              </p>

              <div className="flex gap-4 mt-4 w-full justify-center">
                <Button
                  className="bg-[#ff6c00] text-white py-3 px-6 w-60 rounded-lg font-medium hover:bg-[#FF9D55]"
                  // styles={{
                  //   background: '#ff6c00',
                  //   color: 'white',
                  //   padding: '.7rem 1.4rem',
                  //   width: '15rem',
                  //   borderRadius: '.5rem',
                  //   fontSize: '.9rem',
                  //   fontWeight: '500',
                  // }}
                  text="Done"
                  onclick={toggleDeleteSuccessModal}
                />
              </div>
            </div>
          </Modal>
        </>
      )}
      {showSaveSuccessModal && (
        <>
          <Backdrop />
          <Modal>
            <div className=" flex flex-col items-center justify-center gap-8 p-2">
              <div className="flex w-full justify-end">
                <div
                  className="w-10 cursor-pointer"
                  onClick={toggleSaveSuccessModal}
                >
                  <img className="w-full" src={closeIcon} alt="close icon" />
                </div>
              </div>

              <img className="" src={successIcon} alt="success icon" />

              <h2 className="text-xl font-[500]">Successful</h2>

              <p className="text-[#797b89] text-center text-md">
                Image successfully downloaded
              </p>

              <div className="flex gap-4 mt-4 w-full justify-center">
                <Button
                  className="bg-[#ff6c00] text-white py-3 px-6 w-60 rounded-lg font-medium hover:bg-[#FF9D55]"
                  // styles={{
                  //   background: '#ff6c00',
                  //   color: 'white',
                  //   padding: '.7rem 1.4rem',
                  //   width: '15rem',
                  //   borderRadius: '.5rem',
                  //   fontSize: '.9rem',
                  //   fontWeight: '500',
                  // }}
                  text="Done"
                  onclick={toggleSaveSuccessModal}
                />
              </div>
            </div>
          </Modal>
        </>
      )}
    </main>
  );
};

export default BatchDetails;
