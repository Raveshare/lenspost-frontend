import { useContext, useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { SectionTab } from "polotno/side-panel";
import { TemplatesIcon } from "../../../../../assets";
import {
  getAllTemplates,
  getUserPublicTemplates,
} from "../../../../../services";
import { Card } from "@blueprintjs/core";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  ConnectWalletMsgComponent,
  CompModal,
  ErrorComponent,
  MessageComponent,
  SearchComponent,
} from "../../../common";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { Spinner, Icon } from "@blueprintjs/core";
import { useStore } from "../../../../../hooks";
import { fnLoadJsonOnPage, replaceImageURL } from "../../../../../utils";
import { LoadingAnimatedComponent } from "../../../common";
import SuChevronRightDouble from "@meronex/icons/su/SuChevronRightDouble";
import { Context } from "../../../../../context/ContextProvider";

// Design card component start

const DesignCard = observer(
  ({
    id,
    preview,
    json,
    tab,
    isGated,
    gatedWith,
    referredFrom,
    modal,
    setModal,
  }) => {
    const store = useStore();
    const { address } = useAccount();
    const { referredFromRef } = useContext(Context);

    const [stPreviewIndex, setStPreviewIndex] = useState(0);
    const [stHovered, setStHovered] = useState(false);

    const handleClickOrDrop = () => {
      // Show Modal: if it's tokengated
      if (isGated && Object.keys(json).length === 0) {
        setModal({
          ...modal,
          isOpen: true,
          isTokengated: isGated,
          gatedWith: gatedWith,
        });
      } else {
        // Check if there are any elements on the page - to open the Modal or not
        if (store.activePage.children.length > 1) {
          setModal({
            ...modal,
            isOpen: true,
            isNewDesign: true,
            json: json,
          });
        } else {
          // If not load the clicked JSON
          fnLoadJsonOnPage(store, json);
          if (tab === "user") {
            referredFromRef.current.push(...referredFrom);
          }
        }
      }
    };

    // Function to change the preview image on hover
    // Increment the index of the Preview image Array
    const fnChangePreview = (preview) => {
      if (stPreviewIndex < preview.length - 1) {
        setStPreviewIndex(stPreviewIndex + 1);
      } else {
        setStPreviewIndex(0);
      }
    };

    // After a certain interval, change the preview image
    // Using useEffect to capture mouse events & index change
    useEffect(() => {
      if (stHovered) {
        const interval = setInterval(() => {
          fnChangePreview(preview);
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [stHovered, stPreviewIndex]);

    return (
      <Card
        className="rounded-lg"
        style={{ margin: "4px", padding: "0px", position: "relative" }}
        interactive
        onDragEnd={handleClickOrDrop}
        onClick={handleClickOrDrop}
        // To change Preview image on Hover - MouseEnter & MouseLeave
        onMouseEnter={() => {
          setStHovered(true);
        }}
        onMouseLeave={() => {
          setStPreviewIndex(0);
          setStHovered(false);
        }}
      >
        {/* <div className="rounded-lg overflow-hidden transition-transform duration-1000"> */}
        <div className="rounded-lg overflow-hidden transition-transform ease-in-out duration-300 relative">
          {/* If there are more than 1 preview images, then `stPreviewIndex` is incremented */}
          {/* If not on user templates tab, just passing the `preview` - BE response */}

          <LazyLoadImage
            className="rounded-lg"
            placeholderSrc={replaceImageURL(preview[stPreviewIndex])}
            effect="blur"
            src={
              tab === "user"
                ? preview[stPreviewIndex]
                : replaceImageURL(preview)
            }
            alt="Preview Image"
          />
        </div>

        {/* if tab === "user" and  modal.isTokengate === true */}
        {tab === "user" && isGated && (
          <div
            className="bg-white absolute top-2 left-2 p-1 rounded-md "
            // style={{ position: "absolute", top: "8px", left: "8px" }}
          >
            <Icon icon="endorsed" intent="primary" size={16} />
          </div>
        )}

        {/* Display that it contains multiple pages */}
        {tab === "user" && preview.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-white px-1/2 py-1/2 rounded-md">
            <SuChevronRightDouble size="24" />
            {/* <BsChevronDoubleRight size="24" /> */}
          </div>
        )}
      </Card>
    );
  }
);

// Design card component end

const TemplatePanel = () => {
  const [tab, setTab] = useState("lenspost");
  const [stIsModalOpen, setStIsModalOpen] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-lg">Templates</h1>
      <div className="flex items-center justify-center space-x-2 my-4">
        <button
          className={`w-1/2 border px-2 py-1 border-black rounded-md ${
            tab === "lenspost" && "bg-[#1B1A1D]"
          } ${tab === "lenspost" && "text-white"}`}
          onClick={() => setTab("lenspost")}
        >
          Lenspost Templates
        </button>
        <button
          className={`w-1/2 border border-black px-2 py-1 rounded-md ${
            tab === "user" && "bg-[#1B1A1D]"
          } ${tab === "user" && "text-white"}`}
          onClick={() => setTab("user")}
        >
          {/* User Templates */}
          Community Pool
        </button>
      </div>
      {tab === "lenspost" && <LenspostTemplates />}
      {tab === "user" && <UserTemplates />}
    </div>
  );
};

const LenspostTemplates = () => {
  const store = useStore();
  const { address, isDisconnected } = useAccount();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    isTokengated: false,
    gatedWith: "",
    isNewDesign: false,
    json: null,
  });
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["lenspost-templates"],
    queryFn: getAllTemplates,
  });

  if (isDisconnected || !address) {
    return <ConnectWalletMsgComponent />;
  }

  if (isError) {
    return <ErrorComponent message={error} />;
  }

  if (isLoading) {
    return <LoadingAnimatedComponent />;
  }

  return (
    <>
      {modal?.isOpen && modal?.isNewDesign && (
        <CompModal
          modal={modal}
          setModal={setModal}
          ModalTitle={"Are you sure to replace the canvas with this template?"}
          ModalMessage={"This will remove all the content from your canvas"}
          onClickFunction={() => {
            fnLoadJsonOnPage(store, modal?.json);
            setModal({
              isOpen: false,
              isTokengated: false,
              isNewDesign: false,
              json: null,
            });
          }}
        />
      )}
      <SearchComponent
        query={query}
        setQuery={setQuery}
        placeholder={"Search templates"}
      />
      {/* New Design card start - 23Jun2023 */}
      {/* For reference : design - array name, design.id - Key, design.preview - Url  */}
      {/*   Pass these onto Line 25 */}
      {data.length > 0 ? (
        <div className="overflow-y-auto grid grid-cols-2">
          {data.map((item) => {
            return (
              <DesignCard
                // json={item.data}
                // preview={item?.image}
                // key={item.id}
                // tab="lenspost"
                // modal={modal}
                // setModal={setModal}
                id={item?.id}
                referredFrom={item?.referredFrom}
                isGated={item?.isGated}
                gatedWith={item?.gatedWith}
                json={item?.data}
                ownerAddress={item?.ownerAddress}
                preview={
                  item?.imageLink != null &&
                  item?.imageLink.length > 0 &&
                  item?.imageLink
                }
                key={item?.id}
                tab="user"
                modal={modal}
                setModal={setModal}
              />
            );
          })}
        </div>
      ) : (
        <MessageComponent message="No Results" />
      )}

      {/* New Design card end - 23Jun2023 */}
    </>
  );
};

const UserTemplates = () => {
  const store = useStore();
  const { address, isDisconnected } = useAccount();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState({
    isOpen: false,
    isTokengated: false,
    gatedWith: "",
    isNewDesign: false,
    json: null,
  });
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-templates"],
    queryFn: getUserPublicTemplates,
    enabled: address ? true : false,
  });

  if (isDisconnected || !address) {
    return <ConnectWalletMsgComponent />;
  }

  if (isError) {
    return <ErrorComponent message={error} />;
  }

  if (isLoading) {
    return <LoadingAnimatedComponent />;
  }

  return (
    <>
      {/* Show Modal only if it's tokengated, i.e: `isTokengated` & `stOpenTokengatedModal` === true */}
      {modal?.isOpen && modal?.isTokengated && (
        <CompModal
          modal={modal}
          setModal={setModal}
          icon={"disable"}
          ModalTitle={"Access Restricted for this template"}
          ModalMessage={`
          This is a tokengated Template, Please collect this post or buy the NFT to get the access.
          `}
        />
      )}

      {modal?.isOpen && modal?.isNewDesign && (
        <CompModal
          modal={modal}
          setModal={setModal}
          ModalTitle={"Are you sure to replace the canvas with this template?"}
          ModalMessage={"This will remove all the content from your canvas"}
          onClickFunction={() => {
            fnLoadJsonOnPage(store, modal?.json);
            setModal({
              isOpen: false,
              isTokengated: false,
              isNewDesign: false,
              json: null,
            });
          }}
        />
      )}
      <SearchComponent
        query={query}
        setQuery={setQuery}
        placeholder={"Search templates"}
      />
      {/* New Design card start - 23Jun2023 */}
      {/* For reference : design - array name, design.id - Key, design.preview - Url  */}
      {/*   Pass these onto Line 25 */}
      {data?.length > 0 ? (
        <div className="overflow-y-auto grid grid-cols-2">
          {data.map((item) => {
            return (
              <DesignCard
                id={item?.id}
                referredFrom={item?.referredFrom}
                isGated={item?.isGated}
                gatedWith={item?.gatedWith}
                json={item?.data}
                ownerAddress={item?.ownerAddress}
                preview={
                  item?.imageLink != null &&
                  item?.imageLink.length > 0 &&
                  item?.imageLink
                }
                key={item?.id}
                tab="user"
                modal={modal}
                setModal={setModal}
              />
            );
          })}
        </div>
      ) : (
        <MessageComponent message="No Results" />
      )}

      {/* New Design card end - 23Jun2023 */}
    </>
  );
};

// define the new custom section
const TemplateSection = {
  name: "Templates",
  Tab: (props) => (
    <SectionTab name="Templates" {...props}>
      <TemplatesIcon />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: TemplatePanel,
};

export default TemplateSection;
