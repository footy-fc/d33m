// @ts-nocheck
"use client";
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import useFrameEventLogger from '../hooks/useFrameEventLogger';
//import sendFrameTx from './SendTransactionFromFrame';
import { usePrivy } from '@privy-io/react-auth';
type FrameModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  frameUrl?: string | null; // Add this line if it does not exist
};
interface FrameData {
  theme: string;
  url: string | null;
  fid: number;
  transactionsEnabled: boolean;
}
interface FramePopupState {
  notification: {
    opened: boolean;
    title: string;
    subtitle: string;
    message: string;
    action: null | (() => void);
  };
}
const customStyles: Modal.Styles = {
  overlay: {
    zIndex: 15,
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    // width: '90%',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column' as 'column',
    zIndex: 15,
  },
};
const FrameModal: React.FC<FrameModalProps> = ({ isOpen, onRequestClose, frameUrl }) => {
  const [frameContent, setFrameContent] = useState('');
  useFrameEventLogger();
  const { user, sendTransaction } = usePrivy();
  useEffect(() => {
    if (isOpen) {
      const loadFrameContent = async () => {
        try {
          //const response = await fetch('https://ny-1.frames.sh/v/38871'); //https://zora.co/collect/zora:0x273e9371324787308fdb1cf83197ce8740064880/1
          console.log('frameUrl:', frameUrl); 
          const response = await fetch(frameUrl);
          if (!response.ok) {
            console.log(`Error: ${response.statusText}`);
          }
          const content = await response.text();
          setFrameContent(content);
        } catch (error) {
          console.error('Error loading frame content:', error);
        }
      };
      loadFrameContent();
    } else {
      setFrameContent(''); // Reset content when modal is closed
    }
  }, [isOpen]);
  useEffect(() => {
    if (isOpen && frameContent) {
      class FramesEmbedder {
        defaultFid = 628548;
        frameProxy = "https://proxy.frames.sh";
        frameEmbedInputTextValues = {};
        frameEmbedData = {};
        frameEmbedElements = {};
        framePopupStates = {};
        frameButtonClicked = {};
        frameIcons = {
          tx: `
                <svg aria-hidden="true" focusable="false" role="img" class="ml-1 text-faint" viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;"><path d="M9.504.43a1.516 1.516 0 0 1 2.437 1.713L10.415 5.5h2.123c1.57 0 2.346 1.909 1.22 3.004l-7.34 7.142a1.249 1.249 0 0 1-.871.354h-.302a1.25 1.25 0 0 1-1.157-1.723L5.633 10.5H3.462c-1.57 0-2.346-1.909-1.22-3.004L9.503.429Zm1.047 1.074L3.286 8.571A.25.25 0 0 0 3.462 9H6.75a.75.75 0 0 1 .694 1.034l-1.713 4.188 6.982-6.793A.25.25 0 0 0 12.538 7H9.25a.75.75 0 0 1-.683-1.06l2.008-4.418.003-.006a.036.036 0 0 0-.004-.009l-.006-.006-.008-.001c-.003 0-.006.002-.009.004Z"></path></svg>
                `,
          mint: `
                <svg width="14" height="14" viewBox="0 0 28 28" fill="none"><path class="fill-current" fill-rule="evenodd" d="M14.804.333a1.137 1.137 0 0 0-1.608 0L.333 13.196a1.137 1.137 0 0 0 0 1.608l12.863 12.863a1.137 1.137 0 0 0 1.608 0l12.863-12.863a1.137 1.137 0 0 0 0-1.608L14.804.333ZM14 5.159c0-.89-1.077-1.337-1.707-.707l-8.134 8.134a2 2 0 0 0 0 2.828l8.134 8.134c.63.63 1.707.184 1.707-.707V5.159Z" clip-rule="nonzero"></path></svg>
                `,
          link: `
                <svg aria-hidden="true" focusable="false" role="img" class="ml-1 text-faint" viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;"><path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z"></path></svg>
                `,
          redirect: `
                    <svg aria-hidden="true" focusable="false" role="img" class="ml-1 text-faint" viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;"><path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z"></path></svg>
                    `,
        };
        events = {
          LOADING: "Frame loading",
          RENDERED: "Frame rendered",
          FAILED_RENDER: "Frame failed render",
          CLICKED: "Frame button clicked",
          TX: "Frame transaction",
          MINT: "Frame mint",
        };
      
        constructor() {
          this.loadFrames();
        }
      
        loadFrames() {
          const elements = this.getAllFrameEmbedElements();
          for (let i = 0; i < elements.length; i++) {
            const frameEmbedId = parseInt((Math.random() * 100000).toString());
            const frameData = {
              theme: elements[i].dataset["frameTheme"] ?? "dark",
              url: elements[i].dataset["frameUrl"] ?? null,
              fid: elements[i].dataset["frameFid"] ?? this.defaultFid,
              transactionsEnabled:
                elements[i].dataset["frameTransactionsEnabled"] ?? false,
            };
            this.frameEmbedData[frameEmbedId] = frameData;
            this.frameEmbedElements[frameEmbedId] = elements[i];
            this.framePopupStates[frameEmbedId] = {
              notification: {
                opened: false,
                title: "Title",
                subtitle: "Subtitle",
                message: "Message",
                action: null,
              },
            };
            elements[i].setAttribute("frame-embedder-id", frameEmbedId);
            elements[i].innerHTML = this.renderFrame(
              false,
              frameEmbedId,
              elements[i],
              this.createFrameBlur(frameData.theme),
              null,
              frameData.theme
            );
            if (frameData.url === null) {
              continue;
            }
            this.emitFrameEvent(this.events.LOADING, {
              frameId: frameEmbedId,
              url: frameData.url,
            });
            this.loadFrame(frameData.url)
              .then((r) => {
                const { content, image } = r;
                elements[i].innerHTML = this.renderFrame(
                  true,
                  frameEmbedId,
                  elements[i],
                  content,
                  image,
                  frameData.theme
                );
                this.emitFrameEvent(this.events.RENDERED, {
                  frameId: frameEmbedId,
                  url: frameData.url,
                });
              })
              .catch((e) => {
                this.showError(frameEmbedId, frameData.theme);
                this.emitFrameEvent(this.events.FAILED_RENDER, {
                  frameId: frameEmbedId,
                  url: frameData.url,
                });
                console.log("Could not load embedded frame:", e);
              });
          }
        }
      
        loadFrame(frameUrl) {
          return new Promise((resolved, rejected) => {
            console.log("Loading frame:", frameUrl);
            fetch(this.frameProxy + "/" + encodeURIComponent(frameUrl), {
              method: "GET",
              headers: {
                "content-type": "application/json",
              },
              signal: AbortSignal.timeout(5000),
            })
              .then(async (r) => {
                if (r.status !== 200) {
                  throw await r.text();
                }
                return r.json();
              })
              .then((r) => {
                resolved(r);
              })
              .catch((e) => {
                return rejected(new Error(e));
              });
          });
        }
      
        parseFrameHeadDOM(frameContent) {
          const doc = new DOMParser().parseFromString(frameContent, "text/html");
          const head = doc.children[0].children[0].children;
          return head;
        }
      
        getFrameInputs(headNode) {
          let inputs = {};
          for (let i = 0; i < headNode.length; i++) {
            const headItem = headNode[i];
            if (
              headItem !== null &&
              headItem.nodeName === "META" &&
              (headItem.getAttribute("property") ?? headItem.getAttribute("name")) !==
                null &&
              ((
                headItem.getAttribute("property") ?? headItem.getAttribute("name")
              ).indexOf("fc:frame:button") > -1 ||
                (
                  headItem.getAttribute("property") ?? headItem.getAttribute("name")
                ).indexOf("fc:frame:input") > -1 ||
                (
                  headItem.getAttribute("property") ?? headItem.getAttribute("name")
                ).indexOf("of:button") > -1 ||
                (
                  headItem.getAttribute("property") ?? headItem.getAttribute("name")
                ).indexOf("of:input") > -1)
            ) {
              const nodeContent = headItem.getAttribute("content");
              const nodeProperty =
                headItem.getAttribute("property") ?? headItem.getAttribute("name");
              switch (nodeProperty) {
                case "fc:frame:input:text":
                case "of:input:text":
                  {
                    if (inputs === undefined) {
                      inputs = {};
                    }
                    inputs["inputText"] = {
                      id: "inputText",
                      type: "inputText",
                      title: nodeContent,
                      postUrl: "",
                      interaction: null,
                    };
                  }
                  break;
                case "fc:frame:button:1:target":
                case "fc:frame:button:1:post_url":
                case "fc:frame:button:1:action":
                case "fc:frame:button:1":
                case "of:button:1:target":
                case "of:button:1:post_url":
                case "of:button:1:action":
                case "of:button:1":
                  {
                    if (inputs === undefined) {
                      inputs = {};
                    }
                    if ("button1" in inputs === false) {
                      inputs["button1"] = {
                        id: "button1",
                        type: "button1",
                        title: "Button 1",
                        postUrl: nodeContent,
                      };
                    }
                    if (
                      nodeProperty === "fc:frame:button:1:action" ||
                      nodeProperty === "of:button:1:action"
                    ) {
                      inputs["button1"].interaction = nodeContent;
                    } else if (
                      nodeProperty === "fc:frame:button:1:target" ||
                      nodeProperty === "fc:frame:button:1:post_url" ||
                      nodeProperty === "of:button:1:target" ||
                      nodeProperty === "of:button:1:post_url"
                    ) {
                      inputs["button1"].postUrl = nodeContent;
                    } else {
                      inputs["button1"].title = nodeContent;
                    }
                  }
                  break;
                case "fc:frame:button:2:target":
                case "fc:frame:button:2:post_url":
                case "fc:frame:button:2:action":
                case "fc:frame:button:2":
                case "of:button:2:target":
                case "of:button:2:post_url":
                case "of:button:2:action":
                case "of:button:2":
                  {
                    if (inputs === undefined) {
                      inputs = {};
                    }
                    if ("button2" in inputs === false) {
                      inputs["button2"] = {
                        id: "button2",
                        type: "button2",
                        title: "Button 2",
                        postUrl: nodeContent,
                      };
                    }
                    if (
                      nodeProperty === "fc:frame:button:2:action" ||
                      nodeProperty === "of:button:2:action"
                    ) {
                      inputs["button2"].interaction = nodeContent;
                    } else if (
                      nodeProperty === "fc:frame:button:2:target" ||
                      nodeProperty === "fc:frame:button:2:post_url" ||
                      nodeProperty === "of:button:2:target" ||
                      nodeProperty === "of:button:2:post_url"
                    ) {
                      inputs["button2"].postUrl = nodeContent;
                    } else {
                      inputs["button2"].title = nodeContent;
                    }
                  }
                  break;
                case "fc:frame:button:3:target":
                case "fc:frame:button:3:post_url":
                case "fc:frame:button:3:action":
                case "fc:frame:button:3":
                case "of:button:3:target":
                case "of:button:3:post_url":
                case "of:button:3:action":
                case "of:button:3":
                  {
                    if (inputs === undefined) {
                      inputs = {};
                    }
                    if ("button3" in inputs === false) {
                      inputs["button3"] = {
                        id: "button3",
                        type: "button3",
                        title: "Button 3",
                        postUrl: nodeContent,
                      };
                    }
                    if (
                      nodeProperty === "fc:frame:button:3:action" ||
                      nodeProperty === "of:button:3:action"
                    ) {
                      inputs["button3"].interaction = nodeContent;
                    } else if (
                      nodeProperty === "fc:frame:button:3:target" ||
                      nodeProperty === "fc:frame:button:3:post_url" ||
                      nodeProperty === "of:button:3:target" ||
                      nodeProperty === "of:button:3:post_url"
                    ) {
                      inputs["button3"].postUrl = nodeContent;
                    } else {
                      inputs["button3"].title = nodeContent;
                    }
                  }
                  break;
                case "fc:frame:button:4:target":
                case "fc:frame:button:4:post_url":
                case "fc:frame:button:4:action":
                case "fc:frame:button:4":
                case "of:button:4:target":
                case "of:button:4:post_url":
                case "of:button:4:action":
                case "of:button:4":
                  {
                    if (inputs === undefined) {
                      inputs = {};
                    }
                    if ("button4" in inputs === false) {
                      inputs["button4"] = {
                        id: "button4",
                        type: "button4",
                        title: "Button 4",
                        postUrl: nodeContent,
                      };
                    }
                    if (
                      nodeProperty === "fc:frame:button:4:action" ||
                      nodeProperty === "of:button:4:action"
                    ) {
                      inputs["button4"].interaction = nodeContent;
                    } else if (
                      nodeProperty === "fc:frame:button:4:target" ||
                      nodeProperty === "fc:frame:button:4:post_url" ||
                      nodeProperty === "of:button:4:target" ||
                      nodeProperty === "of:button:4:post_url"
                    ) {
                      inputs["button4"].postUrl = nodeContent;
                    } else {
                      inputs["button4"].title = nodeContent;
                    }
                  }
                  break;
              }
            }
          }
          return inputs;
        }
      
        getFrameAspectRaio(headNode) {
          for (let i = 0; i < headNode.length; i++) {
            const headItem = headNode[i];
            if (
              headItem !== null &&
              headItem.nodeName === "META" &&
              (headItem.getAttribute("property") !== null ||
                headItem.getAttribute("name") !== null) &&
              (headItem.getAttribute("property") === "fc:frame:image:aspect_ratio" ||
                headItem.getAttribute("name") === "fc:frame:image:aspect_ratio" ||
                headItem.getAttribute("property") === "of:image:aspect_ratio" ||
                headItem.getAttribute("name") === "of:image:aspect_ratio")
            ) {
              return headItem.getAttribute("content");
            }
          }
        }
      
        getFrameState(headNode) {
          for (let i = 0; i < headNode.length; i++) {
            const headItem = headNode[i];
            if (
              headItem !== null &&
              headItem.nodeName === "META" &&
              (headItem.getAttribute("property") !== null ||
                headItem.getAttribute("name") !== null) &&
              (headItem.getAttribute("property") === "fc:frame:state" ||
                headItem.getAttribute("name") === "fc:frame:state" ||
                headItem.getAttribute("property") === "of:state" ||
                headItem.getAttribute("name") === "of:state")
            ) {
              return headItem.getAttribute("content");
            }
          }
        }
      
        getFrameImage(headNode) {
          for (let i = 0; i < headNode.length; i++) {
            const headItem = headNode[i];
            if (
              headItem !== null &&
              headItem.nodeName === "META" &&
              (headItem.getAttribute("property") !== null ||
                headItem.getAttribute("name") !== null) &&
              (headItem.getAttribute("property") === "fc:frame:image" ||
                headItem.getAttribute("name") === "fc:frame:image" ||
                headItem.getAttribute("property") === "of:image" ||
                headItem.getAttribute("name") === "of:image")
            ) {
              return headItem.getAttribute("content");
            }
          }
        }
      
        setButtonClickedState(frameParentElementId) {
          this.frameButtonClicked[frameParentElementId] = true;
        }
      
        resetButtonClickedState(frameParentElementId) {
          this.frameButtonClicked[frameParentElementId] = false;
        }
      
        performAction(
          frameParentElementId,
          inputs,
          frameState,
          buttonIndex,
          transactionData = null
        ) {
          try {
            if (
              frameParentElementId in this.frameButtonClicked === true &&
              this.frameButtonClicked[frameParentElementId] === true
            ) {
              return;
            }
            const frameElement = this.frameEmbedElements[frameParentElementId];
            const frameTheme = this.frameEmbedData[frameParentElementId].theme;
            const frameTransactionsEnabled =
              this.frameEmbedData[frameParentElementId].transactionsEnabled;
            const inputsDecoded = JSON.parse(decodeURIComponent(inputs));
            const buttonClicked = inputsDecoded["button" + buttonIndex];
            this.emitFrameEvent(this.events.CLICKED, {
              frameId: frameParentElementId,
              url: buttonClicked.postUrl,
              button: buttonClicked,
              inputs,
              state: frameState,
            });
            if (buttonClicked.interaction === "link") {
              this.setNotificationPopup(
                frameParentElementId,
                "Leaving d33m for",
                buttonClicked.postUrl,
                "Are you sure?",
                () => {
                  window.open(buttonClicked.postUrl);
                  this.toggleFramePopup(frameParentElementId, "notification");
                }
              );
              this.toggleFramePopup(frameParentElementId, "notification");
              return;
            }
            if (
              (buttonClicked.interaction === "mint" ||
                buttonClicked.interaction === "tx") &&
              frameTransactionsEnabled === false // cant use if not logged in
            ) {
              this.setNotificationPopup(
                frameParentElementId,
                "Unsupported Action",
                "Tranasctions are unsupported.",
                "A transaction has been requested by the frame. This action is currently not supported."
              );
              this.toggleFramePopup(frameParentElementId, "notification");
              this.resetButtonClickedState(frameParentElementId);
              return;
            }
            if (buttonClicked.interaction === "mint") {
              this.emitFrameEvent(this.events.MINT, {
                frameId: frameParentElementId,
                url: buttonClicked.postUrl,
                mint: buttonClicked.postUrl,
                button: buttonClicked,
                inputs,
                state: frameState,
              });
              return;
            }
            const inputText =
              this.frameEmbedInputTextValues[frameParentElementId] ?? undefined;
            frameElement.children[0].children[0].style.filter = "blur(10px)";
            this.setButtonClickedState();
            this.emitFrameEvent(this.events.LOADING, {
              frameId: frameParentElementId,
              url: buttonClicked.postUrl,
            });
            if (
              transactionData !== null &&
              ("network" in transactionData === false ||
                "transactionId" in transactionData === false ||
                "address" in transactionData === false)
            ) {
              throw "Invalid transaction data provided.";
            }
            this.resolveInputLink(
              buttonClicked.postUrl,
              this.frameEmbedData[frameParentElementId].fid,
              buttonIndex,
              inputText,
              frameState,
              transactionData === null ? undefined : transactionData.network,
              transactionData === null ? undefined : transactionData.transactionId,
              transactionData === null ? undefined : transactionData.address
            )
              .then((r) => {
                const { content, image } = r;
                if (
                  buttonClicked.interaction === "tx" &&
                  this.checkIfTxResponse(content) === true
                ) {
                  frameElement.children[0].children[0].style.filter = "unset";
                  this.emitFrameEvent(this.events.RENDERED, {
                    frameId: frameParentElementId,
                    url: buttonClicked.postUrl,
                  });
                  //KMM TO DO - send transaction
                  //sendFrameTx(true, JSON.parse(r), sendTransaction)
                  
                  this.emitFrameEvent(this.events.TX, {
                    frameId: frameParentElementId,
                    url: buttonClicked.postUrl,
                    button: buttonClicked,
                    transaction: typeof r === "string" ? JSON.parse(r) : r,
                    inputs,
                    state: frameState,
                  });
                  return;
                }
                frameElement.innerHTML = this.renderFrame(
                  true,
                  frameParentElementId,
                  frameElement,
                  content,
                  image,
                  frameTheme
                );
                frameElement.children[0].children[0].style.filter = "unset";
                this.emitFrameEvent(this.events.RENDERED, {
                  frameId: frameParentElementId,
                  url: buttonClicked.postUrl,
                });
                this.resetButtonClickedState(frameParentElementId);
              })
              .catch((e) => {
                this.showError(frameParentElementId, frameTheme);
                this.resetButtonClickedState(frameParentElementId);
                this.emitFrameEvent(this.events.FAILED_RENDER, {
                  frameId: frameParentElementId,
                  url: buttonClicked.postUrl,
                });
                console.log("Frame action failed:", e);
              });
          } catch (e) {
            console.log("Error occured on button click: ", e);
          }
        }
      
        changeInputText(frameParentElementId, inputValue = "") {
          this.frameEmbedInputTextValues[frameParentElementId] = inputValue;
        }
      
        resolveInputLink(
          postUrl,
          fid,
          buttonIndex,
          inputText = undefined,
          state = undefined,
          network = undefined,
          transactionId = undefined,
          address = undefined
        ) {
          const payload = {
            untrustedData: {
              fid: typeof fid === "string" ? parseInt(fid) : fid,
              url: postUrl,
              timestamp: 1706243218,
              network,
              buttonIndex,
              inputText,
              state,
              transactionId,
              address,
            },
          };
          return new Promise((resolved, rejected) => {
            fetch(this.frameProxy, {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                target: postUrl,
                payload,
              }),
            })
              .then(async (r) => {
                if (r.status !== 200) {
                  throw await r.text();
                }
                return r.json();
              })
              .then((r) => {
                resolved(r);
              })
              .catch((e) => {
                return rejected(new Error(e));
              });
          });
        }
      
        checkIfTxResponse(response) {
          try {
            const data =
              typeof response === "string" ? JSON.parse(response) : response;
            return (
              "chainId" in data === true &&
              "method" in data === true &&
              "params" in data &&
              "to" in data.params
            );
          } catch (e) {
            return false;
          }
        }
      
        showError(frameParentElementId, frameTheme = "dark") {
          const frameCanvas = document.querySelectorAll(
            `[data-frame-embedder-canvas='${frameParentElementId}']`
          )[0];
          const errorContent = new Blob([this.createFrameError(frameTheme)], {
            type: "text/html",
          });
          frameCanvas.style.filter = "unset";
          frameCanvas.src = URL.createObjectURL(errorContent);
        }
      
        getAllFrameEmbedElements() {
          return document.getElementsByClassName("frame-embed");
        }
      
        renderFrame(
          renderImageNotHTML,
          frameParentElementId,
          frameParentElement,
          frameContent,
          frameProxyImage = null,
          frameTheme = "dark"
        ) {
          const frameContentNodes = this.parseFrameHeadDOM(frameContent);
          let frameInputs, frameImage, frameAspectRatio, frameState;
          if (renderImageNotHTML === true) {
            frameAspectRatio = this.getFrameAspectRaio(frameContentNodes);
            frameInputs = this.getFrameInputs(frameContentNodes);
            frameState = this.getFrameState(frameContentNodes);
            frameImage =
              frameProxyImage === null
                ? this.getFrameImage(frameContentNodes)
                : frameProxyImage;
          }
          const content = new Blob(
            [
              renderImageNotHTML === false
                ? frameContent
                : this.createFrameWithImage(frameImage),
            ],
            { type: "text/html" }
          );
          const contentUrl = URL.createObjectURL(content);
          const frameSize = this.calculateFrameSize(
            frameParentElement,
            frameAspectRatio
          );
          return `
            <div class="frame-embedder-container ${frameTheme}">
              <iframe data-frame-embedder-canvas="${frameParentElementId}" class="frame-embedder-frame ${frameTheme}" width="${
            frameSize.width
          }" height="${frameSize.height}" style="width: ${
            frameSize.width
          }px; height: ${frameSize.height}px;" src="${contentUrl}">
              </iframe>
              <div class="frame-embedder-inputs ${frameTheme}">
                ${
                  frameInputs === undefined || "inputText" in frameInputs === false
                    ? ""
                    : `<div class="frame-embedder-input ${frameTheme}">
                        <input oninput="window.frameEmbedder.changeInputText('${frameParentElement.getAttribute(
                          "frame-embedder-id"
                        )}', this.value)" placeholder="${
                        frameInputs["inputText"].title
                      }" class="frame-embedder-input-text ${frameTheme}" type="text">
                      </div>`
                }
                <div class="frame-embedder-buttons-container ${frameTheme}">
                  ${
                    frameInputs === undefined || "button1" in frameInputs === false
                      ? ""
                      : `<button onclick="window.frameEmbedder.performAction('${frameParentElement.getAttribute(
                          "frame-embedder-id"
                        )}','${encodeURIComponent(
                          JSON.stringify(frameInputs)
                        )}', '${frameState}', 1)" class="frame-embedder-buttons frame-embedder-button-1 ${frameTheme}">
                          <div class="frame-embedder-button-content">
                            <span class="frame-embedder-button-label">
                              ${frameInputs["button1"].title}
                            </span>
                            <span class="frame-embedder-button-icon ${frameTheme}">
                              ${
                                frameInputs["button1"].interaction === "link" ||
                                frameInputs["button1"].interaction === "post_redirect"
                                  ? this.frameIcons.link
                                  : frameInputs["button1"].interaction === "mint"
                                  ? this.frameIcons.mint
                                  : frameInputs["button1"].interaction === "tx"
                                  ? this.frameIcons.tx
                                  : ""
                              }
                            </span>
                          </div>
                        </button>`
                  }
                  ${
                    frameInputs === undefined || "button2" in frameInputs === false
                      ? ""
                      : `<button onclick="window.frameEmbedder.performAction('${frameParentElement.getAttribute(
                          "frame-embedder-id"
                        )}','${encodeURIComponent(
                          JSON.stringify(frameInputs)
                        )}', '${frameState}', 2)" class="frame-embedder-buttons frame-embedder-button-2 ${frameTheme}">
                          <div class="frame-embedder-button-content">
                            <span class="frame-embedder-button-label">
                              ${frameInputs["button2"].title}
                            </span>
                            <span class="frame-embedder-button-icon ${frameTheme}">
                              ${
                                frameInputs["button2"].interaction === "link" ||
                                frameInputs["button2"].interaction === "post_redirect"
                                  ? this.frameIcons.link
                                  : frameInputs["button2"].interaction === "mint"
                                  ? this.frameIcons.mint
                                  : frameInputs["button2"].interaction === "tx"
                                  ? this.frameIcons.tx
                                  : ""
                              }
                            </span>
                          </div>
                        </button>`
                  }
                  ${
                    frameInputs === undefined || "button3" in frameInputs === false
                      ? ""
                      : `<button onclick="window.frameEmbedder.performAction('${frameParentElement.getAttribute(
                          "frame-embedder-id"
                        )}', '${encodeURIComponent(
                          JSON.stringify(frameInputs)
                        )}', '${frameState}', 3)" class="frame-embedder-buttons frame-embedder-button-3 ${frameTheme}">
                          <div class="frame-embedder-button-content">
                            <span class="frame-embedder-button-label">
                              ${frameInputs["button3"].title}
                            </span>
                            <span class="frame-embedder-button-icon ${frameTheme}">
                              ${
                                frameInputs["button3"].interaction === "link" ||
                                frameInputs["button3"].interaction === "post_redirect"
                                  ? this.frameIcons.link
                                  : frameInputs["button3"].interaction === "mint"
                                  ? this.frameIcons.mint
                                  : frameInputs["button3"].interaction === "tx"
                                  ? this.frameIcons.tx
                                  : ""
                              }
                            </span>
                          </div>
                        </button>`
                  }
                  ${
                    frameInputs === undefined || "button4" in frameInputs === false
                      ? ""
                      : `<button onclick="window.frameEmbedder.performAction('${frameParentElement.getAttribute(
                          "frame-embedder-id"
                        )}','${encodeURIComponent(
                          JSON.stringify(frameInputs)
                        )}', '${frameState}', 4)" class="frame-embedder-buttons frame-embedder-button-4 ${frameTheme}">
                          <div class="frame-embedder-button-content">
                            <span class="frame-embedder-button-label">
                              ${frameInputs["button4"].title}
                            </span>
                            <span class="frame-embedder-button-icon ${frameTheme}">
                              ${
                                frameInputs["button4"].interaction === "link" ||
                                frameInputs["button4"].interaction === "post_redirect"
                                  ? this.frameIcons.link
                                  : frameInputs["button4"].interaction === "mint"
                                  ? this.frameIcons.mint
                                  : frameInputs["button4"].interaction === "tx"
                                  ? this.frameIcons.tx
                                  : ""
                              }
                            </span>
                          </div>
                        </button>`
                  }
                </div>
              </div>
              ${this.createNoticePopup(frameParentElement, frameTheme)}
            </div>
          `;
        }
      
        calculateFrameSize(frameParentElement, frameRatio = "1.91:1") {
          const ratioNumber = parseFloat(frameRatio.split(":")[0]);
          const frameWidth = frameParentElement.clientWidth;
          return { width: frameWidth, height: frameWidth * (1 / ratioNumber) };
        }
      
        emitFrameEvent(event, message) {
          window.postMessage(
            {
              type: event,
              content: message,
            },
            "*"
          );
        }
      
        toggleFramePopup(frameParentElementId, popupType) {
          this.framePopupStates[frameParentElementId][popupType].opened =
            !this.framePopupStates[frameParentElementId][popupType].opened;
          const isOpen =
            this.framePopupStates[frameParentElementId][popupType].opened === true;
          const popupElement = document.querySelectorAll(
            `[data-frame-embedder-popup-id='${frameParentElementId}-${popupType}']`
          )[0];
          if (popupElement === null) {
            return;
          }
          if (popupType === "notification") {
            const popupElementTitle = document.querySelectorAll(
              `[data-frame-embedder-popup-title='${frameParentElementId}-${popupType}']`
            )[0];
            const popupElementSubtitle = document.querySelectorAll(
              `[data-frame-embedder-popup-subtitle='${frameParentElementId}-${popupType}']`
            )[0];
            const popupElementMessage = document.querySelectorAll(
              `[data-frame-embedder-popup-message='${frameParentElementId}-${popupType}']`
            )[0];
            popupElementTitle.innerText =
              this.framePopupStates[frameParentElementId][popupType].title;
            popupElementSubtitle.innerText =
              this.framePopupStates[frameParentElementId][popupType].subtitle;
            popupElementMessage.innerText =
              this.framePopupStates[frameParentElementId][popupType].message;
          }
          if (isOpen === true) {
            popupElement.style.display = "flex";
            popupElement.classList.remove("slide-bottom");
            popupElement.classList.add("slide-top");
          } else {
            popupElement.classList.remove("slide-top");
            popupElement.classList.add("slide-bottom");
          }
        }
      
        setNotificationPopup(
          frameParentElementId,
          title,
          subtitle,
          message,
          action = null
        ) {
          this.framePopupStates[frameParentElementId]["notification"].title = title;
          this.framePopupStates[frameParentElementId]["notification"].subtitle =
            subtitle;
          this.framePopupStates[frameParentElementId]["notification"].message =
            message;
          this.framePopupStates[frameParentElementId]["notification"].action = action;
        }
      
        performPopupAction(frameParentElementId, popupType) {
          const action =
            this.framePopupStates[frameParentElementId][popupType].action;
          if (action === null) {
            return;
          }
          action();
        }
      
        createFrameWithImage(imageUrl) {
          return `
            <head>
              <meta charset="UTF-8" />
              <style type="text/css">
                body{
                  background-image: url(${imageUrl});
                  background-position: center top;
                  background-size: 100%;
                  background-repeat: no-repeat;
                }
              </style>
              <body>
              </body>
            </head>
          `;
        }
      
        createFrameError(frameTheme = "dark") {
          return `
            <html>
              <head>
                <meta charset="UTF-8" />
                <title>Frames.sh — Build the next Frame.</title>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                />
                <style type="text/css">
                  html, body{
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                    padding: 0;
                    margin: 0;
                    box-sizing: border-box;
                    font-family: arial;
                    color: ${frameTheme === "dark" ? "#8c8c8c" : "#555555"};
                    background-color: ${frameTheme === "dark" ? "#1a1a1a" : "#acacac"}
                  }  
                </style>
              </head>
              <body style='display: flex; overflow: hidden; align-items: center; justify-content: center; filter: grayscale(1); padding: 0;'>
                An error has occured while loading the frame.  
              </body>
            </html
          `;
        }
      
        createFrameBlur(frameTheme = "dark") {
          return `
            <html>
              <head>
                <meta charset="UTF-8" />
                <title>Frames.sh — Build the next Frame.</title>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                />
                <style type="text/css">
                  html, body{
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                    padding: 0;
                    margin: 0;
                    box-sizing: border-box;
                    color: ${frameTheme === "dark" ? "#8c8c8c" : "#555555"};
                    background-color: ${frameTheme === "dark" ? "#1a1a1a" : "#acacac"}
                  }  
                  .loader{
                    transform: scale(0.1);
                  }
                </style>
              </head>
              <body style='display: flex; overflow: hidden; align-items: center; justify-content: center; filter: grayscale(1); padding: 0;'>
                <svg class="loader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect fill="#FF156D" stroke="#FF156D" stroke-width="2" width="30" height="30" x="25" y="85"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></rect><rect fill="#FF156D" stroke="#FF156D" stroke-width="2" width="30" height="30" x="85" y="85"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></rect><rect fill="#FF156D" stroke="#FF156D" stroke-width="2" width="30" height="30" x="145" y="85"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></rect></svg>
              </body>
            </html
          `;
        }
      
        createNoticePopup(frameParentElement, frameTheme = "dark") {
          const frameEmbedderId =
            frameParentElement.getAttribute("frame-embedder-id");
          return `
            <div data-frame-embedder-popup-id="${frameEmbedderId}-notification" class="frame-embedder-popup ${frameTheme}">
              <div class="frame-embedder-popup-header ${frameTheme}">
                <div class="frame-embedder-popup-header-left ${frameTheme}">
                  &nbsp;
                </div>
                <div data-frame-embedder-popup-title="${frameEmbedderId}-notification" class="frame-embedder-popup-header-middle ${frameTheme}">
                  MESSAGE
                </div>
                <div class="frame-embedder-popup-header-right ${frameTheme}">
                  <button onclick="window.frameEmbedder.toggleFramePopup(${frameEmbedderId}, 'notification')" class="frame-embedder-popup-header-button frame-embedder-popup-header-button-close ${frameTheme}">
                    ×
                  </button>
                </div>
              </div>
              <div class="frame-embedder-popup-content ${frameTheme}">
                <div class="frame-embedder-popup-content-item ${frameTheme}">
                  <div data-frame-embedder-popup-subtitle="${frameEmbedderId}-notification" class="frame-embedder-popup-content-item-note frame-embedder-popup-subtitle ${frameTheme}">
                    SUBTITLE
                  </div>
                </div>
                <div class="frame-embedder-popup-content-item ${frameTheme}">
                  <div data-frame-embedder-popup-message="${frameEmbedderId}-notification" class="frame-embedder-popup-content-item-note frame-embedder-popup-message ${frameTheme}">
                    MESSAGE
                  </div>
                </div>
              </div>
              <div class="frame-embedder-popup-footer ${frameTheme}">
                <button onclick="window.frameEmbedder.toggleFramePopup(${frameEmbedderId}, 'notification')" class="frame-embedder-popup-button frame-embedder-popup-cancel ${frameTheme}">
                  Cancel
                </button>
                <button onclick="window.frameEmbedder.performPopupAction(${frameEmbedderId}, 'notification')" class="frame-embedder-popup-button frame-embedder-popup-proceed ${frameTheme}">
                  Proceed
                </button>
              </div>
            </div>
          `;
        }
      }
      window.frameEmbedder = new FramesEmbedder();
    }
  }, [isOpen, frameContent]);
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <div className="flex flex-col items-center bg-deepPink text-white font-semibold text-medium p-2 rounded-lg w-full max-w-full h-full max-h-full overflow-auto  w-full max-w-md">
        <button className="absolute top-0 right-0 text-lightPurple" onClick={onRequestClose}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div
          data-frame-fid="628548"
          data-frame-transactions-enabled="true"
          data-frame-theme="dark"
          data-frame-url={frameUrl}
          className="frame-embed frames w-full h-full"
          dangerouslySetInnerHTML={{ __html: frameContent }}
        ></div>
        <div className="ml-auto text-sm text-slate-500">
          <a href={frameUrl} target="_blank" rel="noopener noreferrer">
            {frameUrl}
          </a>
        </div>
      </div>
    </Modal>
  );
};
export default FrameModal;