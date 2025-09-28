import React, { useRef } from "react";

import { newTextElement } from "@excalidraw/element";

import "./LibraryMenuItems.scss";

import type {
  ExcalidrawProps,
  LibraryItem,
  LibraryItems,
  UIAppState,
  ExcalidrawImperativeAPI,
} from "../types";

// Complete list of all JPG assets from the library-assets folder
const svgAssets = [
  {
    id: "4-ways",
    name: "4 Ways",
    src: "/library-assets/4 Ways.jpg",
  },
  {
    id: "ai-letters",
    name: "AI Letters",
    src: "/library-assets/AI letters.jpg",
  },
  {
    id: "ai-wand",
    name: "AI Wand",
    src: "/library-assets/AI Wand.jpg",
  },
  {
    id: "anahata-flower",
    name: "Anahata Flower",
    src: "/library-assets/Anahata~Flower.jpg",
  },
  {
    id: "bolt-flash",
    name: "Bolt Flash",
    src: "/library-assets/Bolt flash.jpg",
  },
  {
    id: "burning-core",
    name: "Burning Core",
    src: "/library-assets/Burning Core.jpg",
  },
  {
    id: "butterfly-front",
    name: "Butterfly Front",
    src: "/library-assets/Butterfly~ Front.jpg",
  },
  {
    id: "butterfly-left",
    name: "Butterfly Left",
    src: "/library-assets/Butterfly~ Left Side.jpg",
  },
  {
    id: "butterfly-right",
    name: "Butterfly Right",
    src: "/library-assets/Butterfly~ Right side.jpg",
  },
  {
    id: "calendar",
    name: "Calendar",
    src: "/library-assets/calender.jpg",
  },
  {
    id: "celestial-body",
    name: "Celestial Body",
    src: "/library-assets/Celestial body.jpg",
  },
  {
    id: "cheese",
    name: "Cheese",
    src: "/library-assets/Cheese.jpg",
  },
  {
    id: "chitti-robo",
    name: "Chitti Robo",
    src: "/library-assets/Chitti Robo.jpg",
  },
  {
    id: "circle-eye-smiley",
    name: "Circle Eye Smiley",
    src: "/library-assets/Circle Eye Smiley.jpg",
  },
  {
    id: "cloud-basic",
    name: "Cloud Basic",
    src: "/library-assets/Cloud Basic.jpg",
  },
  {
    id: "colour-chart",
    name: "Colour Chart",
    src: "/library-assets/Colour chart.jpg",
  },
  {
    id: "delulu",
    name: "Delulu",
    src: "/library-assets/delulu.jpg",
  },
  {
    id: "disco",
    name: "Disco",
    src: "/library-assets/Disco.svg",
  },
  {
    id: "discount-flash",
    name: "Discount Flash",
    src: "/library-assets/Discount Flash.svg",
  },
  {
    id: "discount-ticket",
    name: "Discount Ticket",
    src: "/library-assets/Discount Ticket.svg",
  },
  {
    id: "discounted-item",
    name: "Discounted Item",
    src: "/library-assets/Discounted item.svg",
  },
  {
    id: "droplet",
    name: "Droplet",
    src: "/library-assets/Droplet.svg",
  },
  {
    id: "echo-flash",
    name: "Echo Flash",
    src: "/library-assets/Echo Flash.svg",
  },
  {
    id: "eight-pointed-shuriken",
    name: "Eight-Pointed Shuriken",
    src: "/library-assets/Eight-Pointed Shuriken.svg",
  },
  {
    id: "eye-swirl",
    name: "Eye Swirl",
    src: "/library-assets/Eye swirl.svg",
  },
  {
    id: "figma",
    name: "Figma",
    src: "/library-assets/Figma.svg",
  },
  {
    id: "fire-shield",
    name: "Fire Shield",
    src: "/library-assets/fire shield.svg",
  },
  {
    id: "flash-fury",
    name: "Flash Fury",
    src: "/library-assets/Flash Fury.svg",
  },
  {
    id: "fork-walk",
    name: "Fork Walk",
    src: "/library-assets/Fork walk.svg",
  },
  {
    id: "four-ace",
    name: "Four Ace",
    src: "/library-assets/Four ace.svg",
  },
  {
    id: "four-point-shuriken",
    name: "Four-Point Shuriken",
    src: "/library-assets/Four-Point Shuriken.svg",
  },
  {
    id: "growth-tree",
    name: "Growth Tree",
    src: "/library-assets/growth tree.svg",
  },
  {
    id: "half-moon-smiley",
    name: "Half-Moon Smiley",
    src: "/library-assets/Half-Moon Smiley.svg",
  },
  {
    id: "halloween-cute-ghost",
    name: "Halloween Cute Ghost",
    src: "/library-assets/Halloween-CuteGhost.svg",
  },
  {
    id: "halloween-pumpkin",
    name: "Halloween Pumpkin",
    src: "/library-assets/Halloween~Pumpkin.svg",
  },
  {
    id: "heart-cut",
    name: "Heart Cut",
    src: "/library-assets/heart cut.svg",
  },
  {
    id: "hour-glass",
    name: "Hour Glass",
    src: "/library-assets/Hour glass.svg",
  },
  {
    id: "ice-tub",
    name: "Ice Tub",
    src: "/library-assets/Ice-Tub.svg",
  },
  {
    id: "icecream",
    name: "Ice Cream",
    src: "/library-assets/Icecream.svg",
  },
  {
    id: "icon-1",
    name: "Icon 1",
    src: "/library-assets/icon-1.svg",
  },
  {
    id: "icon-2",
    name: "Icon 2",
    src: "/library-assets/icon-2.svg",
  },
  {
    id: "inception",
    name: "Inception",
    src: "/library-assets/Inception.svg",
  },
  {
    id: "jingles",
    name: "Jingles",
    src: "/library-assets/Jingles.svg",
  },
  {
    id: "lantern",
    name: "Lantern",
    src: "/library-assets/Lantern.svg",
  },
  {
    id: "lightning-offers",
    name: "Lightning Offers",
    src: "/library-assets/Lightning offers.svg",
  },
  {
    id: "limited-deals",
    name: "Limited Deals",
    src: "/library-assets/Limited deals.svg",
  },
  {
    id: "moon-walker",
    name: "Moon Walker",
    src: "/library-assets/moon walker.svg",
  },
  {
    id: "music-ai",
    name: "Music AI",
    src: "/library-assets/Music AI.svg",
  },
  {
    id: "orange",
    name: "Orange",
    src: "/library-assets/Orange.svg",
  },
  {
    id: "palette",
    name: "Palette",
    src: "/library-assets/pallette.svg",
  },
  {
    id: "palm-leaf",
    name: "Palm Leaf",
    src: "/library-assets/Palm Leaf.svg",
  },
  {
    id: "peri-winkle",
    name: "Periwinkle",
    src: "/library-assets/peri Winkle.svg",
  },
  {
    id: "popper",
    name: "Popper",
    src: "/library-assets/Popper.svg",
  },
  {
    id: "poppy",
    name: "Poppy",
    src: "/library-assets/poppy.svg",
  },
  {
    id: "power-button-smiley",
    name: "Power Button Smiley",
    src: "/library-assets/Power Button Smiley.svg",
  },
  {
    id: "pushpak",
    name: "Pushpak",
    src: "/library-assets/pushpak.svg",
  },
  {
    id: "rasen-shuriken",
    name: "Rasen Shuriken",
    src: "/library-assets/Rasen Shuriken.svg",
  },
  {
    id: "rocketry",
    name: "Rocketry",
    src: "/library-assets/Rocketry.svg",
  },
  {
    id: "rose",
    name: "Rose",
    src: "/library-assets/Rose.svg",
  },
  {
    id: "shield",
    name: "S.H.I.E.L.D",
    src: "/library-assets/S.H.I.E.L.D.svg",
  },
  {
    id: "shape-1",
    name: "Shape 1",
    src: "/library-assets/shape-1.svg",
  },
  {
    id: "shape-2",
    name: "Shape 2",
    src: "/library-assets/shape-2.svg",
  },
  {
    id: "shimmer-love",
    name: "Shimmer Love",
    src: "/library-assets/Shimmer love.svg",
  },
  {
    id: "single-leaf",
    name: "Single Leaf",
    src: "/library-assets/Single~Leaf.svg",
  },
  {
    id: "smile-please",
    name: "Smile Please",
    src: "/library-assets/Smile please.svg",
  },
  {
    id: "sunriser",
    name: "Sunriser",
    src: "/library-assets/Sunriser.svg",
  },
  {
    id: "target",
    name: "Target",
    src: "/library-assets/target.svg",
  },
  {
    id: "textbox",
    name: "TextBox",
    src: "/library-assets/TextBox.svg",
  },
  {
    id: "thunder-roar",
    name: "Thunder Roar",
    src: "/library-assets/Thunder Roar.svg",
  },
  {
    id: "utility",
    name: "Utility",
    src: "/library-assets/utillity.svg",
  },
  {
    id: "vikram-lander",
    name: "Vikram Lander",
    src: "/library-assets/Vikram lander.svg",
  },
  {
    id: "wave-cloud",
    name: "Wave Cloud",
    src: "/library-assets/Wave Cloud(also croissant).svg",
  },
  {
    id: "wide-eye",
    name: "Wide Eye",
    src: "/library-assets/wide eye.svg",
  },
  {
    id: "winner",
    name: "Winner",
    src: "/library-assets/Winner.svg",
  },
];

export default function LibraryMenuItems({
  isLoading,
  libraryItems,
  onAddToLibrary,
  onInsertLibraryItems,
  pendingElements,
  theme,
  id,
  libraryReturnUrl,
  onSelectItems,
  selectedItems,
  excalidrawAPI,
}: {
  isLoading: boolean;
  libraryItems: LibraryItems;
  pendingElements: LibraryItem["elements"];
  onInsertLibraryItems: (libraryItems: LibraryItems) => void;
  onAddToLibrary: (elements: LibraryItem["elements"]) => void;
  libraryReturnUrl: ExcalidrawProps["libraryReturnUrl"];
  theme: UIAppState["theme"];
  id: string;
  selectedItems: LibraryItem["id"][];
  onSelectItems: (id: LibraryItem["id"][]) => void;
  excalidrawAPI?: ExcalidrawImperativeAPI;
}) {
  const libraryContainerRef = useRef<HTMLDivElement>(null);

  const handleSvgClick = async (asset: typeof svgAssets[0]) => {
    try {
      // Fetch the SVG file
      const response = await fetch(asset.src);
      const svgBlob = await response.blob();
      
      // Create a File object from the blob (this is what fileOpen returns)
      const file = new File([svgBlob], `${asset.name}.svg`, {
        type: "image/svg+xml",
      });
      
      // Check if excalidrawAPI is available
      if (excalidrawAPI) {
        try {
          // Get the canvas center coordinates
          const appState = excalidrawAPI.getAppState();
          const canvasCenter = {
            clientX: appState.width / 2 + appState.offsetLeft,
            clientY: appState.height / 2 + appState.offsetTop,
          };
          
          // Trigger the image insertion by simulating the same flow
          // Since insertImages is private, we'll create a custom drop event
          const dropEvent = new DragEvent("drop", {
            bubbles: true,
            cancelable: true,
            dataTransfer: new DataTransfer(),
          });
          
          // Add the file to the drop event
          dropEvent.dataTransfer?.items.add(file);
          
          // Set the position where the image should be dropped
          Object.defineProperty(dropEvent, "clientX", {
            value: canvasCenter.clientX,
          });
          Object.defineProperty(dropEvent, "clientY", {
            value: canvasCenter.clientY,
          });
          
          // Find the canvas element and dispatch the drop event
          const canvasElement = document.querySelector(".excalidraw__canvas");
          if (canvasElement) {
            canvasElement.dispatchEvent(dropEvent);
          } else {
            console.error("Canvas element not found");
            handleFallback(asset);
          }
        } catch (error) {
          console.error("Error simulating drop:", error);
          handleFallback(asset);
        }
      } else {
        // Fallback: create a text element
        handleFallback(asset);
      }
    } catch (error) {
      console.error("Error handling SVG click:", error);
      handleFallback(asset);
    }
  };

  // Fallback function for when SVG processing fails
  const handleFallback = (asset: typeof svgAssets[0]) => {
    const textElement = newTextElement({
      x: 200,
      y: 200,
      text: `📎 ${asset.name}`,
      fontSize: 16,
      fontFamily: 1,
      textAlign: "center",
      verticalAlign: "middle",
      strokeColor: "#1971c2",
    });

    const libraryItem: LibraryItem = {
      id: `fallback-${asset.id}-${Date.now()}`,
      status: "published",
      elements: [textElement],
      created: Date.now(),
      name: asset.name,
    };

    onInsertLibraryItems([libraryItem]);
  };

  return (
    <div className="library-menu-items-container">
      <div
        className="svg-assets-grid"
        ref={libraryContainerRef}
        role="grid"
        aria-label="SVG Assets Library"
      >
        {svgAssets.map((asset) => (
          <div
            key={asset.id}
            className="svg-asset-item"
            role="gridcell"
            tabIndex={0}
            aria-label={`${asset.name} asset`}
            onClick={() => handleSvgClick(asset)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSvgClick(asset);
              }
            }}
          >
            <div className="svg-asset-preview">
              <img
                src={asset.src}
                alt={asset.name}
                className="svg-asset-image"
                loading="lazy"
              />
            </div>
            <div className="svg-asset-name">{asset.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
