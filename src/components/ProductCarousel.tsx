import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "../lib/supabase";

const PLACEHOLDERS: Product[] = [
  {
    id: "1",
    name: "Torta Vintage",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    price: 85000,
    image_url:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80",
    category: "Tortas",
    active: true,
    featured: true,
    created_at: "",
  },
  {
    id: "2",
    name: "Cupcakes Rosas",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute.",
    price: 12000,
    image_url:
      "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=600&q=80",
    category: "Cupcakes",
    active: true,
    featured: true,
    created_at: "",
  },
  {
    id: "3",
    name: "Macarons Clemmie",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint.",
    price: 8000,
    image_url:
      "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&q=80",
    category: "Macarons",
    active: true,
    featured: true,
    created_at: "",
  },
  {
    id: "4",
    name: "Cheesecake de Frutas",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum sed perspiciatis.",
    price: 55000,
    image_url:
      "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=80",
    category: "Tartas",
    active: true,
    featured: true,
    created_at: "",
  },
];

interface Props {
  products: Product[];
  loading: boolean;
}

export default function ProductCarousel({ products, loading }: Props) {
  const items = /*products.length > 0 ? products :*/ PLACEHOLDERS;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    intervalRef.current = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [emblaApi]);

  if (loading)
    return (
      <section id="productos" className="py-16 bg-[#D9D9D9]">
        <div className="max-w-5xl mx-auto px-20">
          <div className="h-80 bg-white/20 rounded-2xl animate-pulse" />
        </div>
      </section>
    );

  return (
    <section id="productos" className="relative py-16 bg-[#D9D9D9]">
      {/* Title */}
      <h2 className="text-3xl font-medium text-brand-dark text-center">
        Productos
      </h2>

      {/* Left arrow */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10
                   w-9 h-9 flex rounded-md items-center justify-center
                   text-brand-dark hover:bg-brand-red hover:text-white transition-all duration-200"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10
                   w-9 h-9 flex rounded-md items-center justify-center
                   text-brand-dark hover:bg-brand-red hover:text-white transition-all duration-200"
      >
        <ChevronRight size={24} />
      </button>

      {/* Carousel */}
      <div className="max-w-4xl mx-auto py-24 px-16 sm:px-24">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {items.map((product) => (
              <div key={product.id} className="flex-none w-full">
                {/* Card — two columns desktop, stacked mobile */}
                <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 sm:h-[469px]">
                  {/* Left: image rectangle — explicit h on desktop, aspect-ratio on mobile */}
                  <div
                    className="flex-shrink-0 rounded-xl overflow-hidden w-full max-w-[370px] mx-auto sm:mx-0 sm:w-[370px] sm:h-full"
                    style={{ aspectRatio: "370 / 469" }}
                  >
                    <img
                      src={
                        product.image_url ||
                        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80";
                      }}
                    />
                  </div>

                  {/* Right: info column — height = card height, justify-center centers content */}
                  <div className="flex-1 flex flex-col justify-center gap-5">
                    <h3 className="text-xl text-brand-dark tracking-wide">
                      {product.name}
                    </h3>

                    <p className="text-brand-dark/55 text-sm leading-relaxed">
                      {product.description ||
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
                    </p>

                    <div className="flex justify-end">
                      <button
                        onClick={() =>
                          document
                            .querySelector("#contacto")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="px-3 py-1.5 border border-brand-red text-brand-red rounded-md text-xs tracking-wide bg-white
                                   hover:bg-brand-red hover:text-white transition-all duration-200"
                      >
                        Ver productos
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`rounded-sm transition-all duration-300 ${
                i === selectedIndex
                  ? "w-5 h-1.5 bg-brand-red"
                  : "w-1.5 h-1.5 bg-brand-dark/20 hover:bg-brand-dark/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
