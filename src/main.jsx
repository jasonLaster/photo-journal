import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Camera, Grid3X3, Maximize2, Search, SlidersHorizontal } from "lucide-react";
import { MasonryPhotoAlbum } from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "react-photo-album/masonry.css";
import "yet-another-react-lightbox/styles.css";
import { sections } from "./galleryData.js";
import "./styles.css";

const TILE_GAP = 12;
const TILE_PADDING = 4;

function App() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [lightbox, setLightbox] = useState(null);

  const visibleSections = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return sections
      .filter((section) => activeFilter === "all" || section.id === activeFilter)
      .map((section) => ({
        ...section,
        photos: section.photos.filter((item) => {
          if (!normalized) return true;
          return [section.title, section.note, item.title, item.dateLabel, item.tone, ...item.tags]
            .join(" ")
            .toLowerCase()
            .includes(normalized);
        }),
      }))
      .filter((section) => section.photos.length > 0);
  }, [activeFilter, query]);

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
      <header className="topbar">
        <a className="brand" href="/" aria-label="Jason's Photo Shelf home">
          <Camera aria-hidden="true" size={20} strokeWidth={2.1} />
          <span>Jason's Photo Shelf</span>
        </a>

        <nav className="filters" aria-label="Gallery sections">
          <button
            className={activeFilter === "all" ? "filter active" : "filter"}
            type="button"
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          {sections.map((section) => (
            <button
              className={activeFilter === section.id ? "filter active" : "filter"}
              type="button"
              key={section.id}
              onClick={() => setActiveFilter(section.id)}
            >
              {section.title}
            </button>
          ))}
        </nav>

        <label className="search">
          <Search aria-hidden="true" size={17} />
          <span className="sr-only">Search photos</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            type="search"
          />
        </label>
      </header>

      <main className="page-shell">
        <section className="gallery-heading" aria-labelledby="gallery-title">
          <div>
            <p className="eyebrow">
              <Grid3X3 aria-hidden="true" size={15} />
              Static photo archive
            </p>
            <h1 id="gallery-title">Small photos, kept uneven.</h1>
          </div>
          <a className="album-link" href={`#${sections[0]?.id ?? ""}`}>
            <SlidersHorizontal aria-hidden="true" size={17} />
            <span>Open album</span>
          </a>
        </section>

        <div className="section-stack">
          {visibleSections.map((section) => (
            <PhotoSection
              key={section.id}
              section={section}
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

function PhotoSection({ section, onOpen }) {
  return (
    <section className="photo-section" id={section.id} aria-labelledby={`${section.id}-title`}>
      <div className="section-header">
        <div>
          <h2 id={`${section.id}-title`}>{section.title}</h2>
          <p>{section.note}</p>
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
