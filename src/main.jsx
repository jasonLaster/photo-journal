import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Maximize2 } from "lucide-react";
import { MasonryPhotoAlbum } from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "react-photo-album/masonry.css";
import "yet-another-react-lightbox/styles.css";
import { sections } from "./galleryData.js";
import "./styles.css";

const TILE_GAP = 12;
const TILE_PADDING = 4;

function App() {
  const [activeTag, setActiveTag] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const visibleSections = useMemo(() => {
    return sections
      .map((section) => ({
        ...section,
        photos: section.photos.filter((item) => {
          if (!activeTag) return true;
          return item.tags.includes(activeTag);
        }),
      }))
      .filter((section) => section.photos.length > 0);
  }, [activeTag]);

  const activeSlides =
    lightbox?.photos.map((item) => ({
      src: item.src,
      alt: item.alt,
      width: item.width,
      height: item.height,
      title: item.title,
    })) ?? [];

  return (
    <>
      <main className="page-shell">
        <div className="section-stack">
          {visibleSections.map((section) => (
            <PhotoSection
              key={section.id}
              section={section}
              activeTag={activeTag}
              onTagChange={setActiveTag}
              onOpen={(index) => setLightbox({ photos: section.photos, index })}
            />
          ))}
        </div>
      </main>

      <Lightbox
        open={Boolean(lightbox)}
        close={() => setLightbox(null)}
        slides={activeSlides}
        index={lightbox?.index ?? 0}
      />
    </>
  );
}

function PhotoSection({ section, activeTag, onTagChange, onOpen }) {
  return (
    <section className="photo-section" id={section.id} aria-labelledby={`${section.id}-title`}>
      <div className="section-header">
        <div>
          <h2 id={`${section.id}-title`}>{section.title}</h2>
          <div className="tag-filters" aria-label={`${section.title} hashtags`}>
            <button
              className={!activeTag ? "tag-filter active" : "tag-filter"}
              type="button"
              onClick={() => onTagChange(null)}
            >
              All
            </button>
            {section.tags.map((tag) => (
              <button
                className={activeTag === tag ? "tag-filter active" : "tag-filter"}
                type="button"
                key={tag}
                onClick={() => onTagChange(activeTag === tag ? null : tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
        <div className="section-meta">
          <span>{section.range}</span>
          <span>{section.photos.length} frames</span>
        </div>
      </div>

      <MasonryPhotoAlbum
        photos={section.photos}
        spacing={TILE_GAP}
        padding={TILE_PADDING}
        columns={(containerWidth) => {
          if (containerWidth < 520) return 1;
          if (containerWidth < 840) return 2;
          if (containerWidth < 1160) return 3;
          return section.photos.length > 6 ? 4 : 3;
        }}
        sizes={{
          size: "1180px",
          sizes: [
            { viewport: "(max-width: 760px)", size: "calc(100vw - 32px)" },
            { viewport: "(max-width: 1280px)", size: "calc(100vw - 80px)" },
          ],
        }}
        onClick={({ index }) => onOpen(index)}
        render={{
          image: (props, { photo }) => (
            <img
              {...props}
              alt={photo.alt}
              className={`${props.className ?? ""} gallery-image`}
              title={photo.title}
            />
          ),
          extras: (_, { photo }) => (
            <>
              <span className={`tone-dot ${photo.tone}`} aria-hidden="true" />
              <span className="tile-caption">
                <span>{photo.title}</span>
                <small>{photoTagText(photo)}</small>
              </span>
              <Maximize2 className="expand-icon" aria-hidden="true" size={16} />
            </>
          ),
        }}
      />
    </section>
  );
}

function photoTagText(photo) {
  if (photo.tags.length === 0) return photo.dateLabel;
  return photo.tags.map((tag) => `#${tag}`).join(" ");
}

createRoot(document.getElementById("root")).render(<App />);
