import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  CheckCircle,
  ChevronDown,
  Instagram,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiFacebook, SiX } from "react-icons/si";
import { toast } from "sonner";
import type { CartItem, Perfume } from "./backend.d";
import {
  useAddToCart,
  useClearCart,
  useGetAllPerfumes,
  useGetCart,
  usePlaceOrder,
  useRemoveFromCart,
} from "./hooks/useQueries";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(cents: bigint): string {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

function getCategoryImage(category: string): string {
  const map: Record<string, string> = {
    floral: "/assets/generated/perfume-floral.dim_400x500.jpg",
    woody: "/assets/generated/perfume-woody.dim_400x500.jpg",
    citrus: "/assets/generated/perfume-citrus.dim_400x500.jpg",
    oriental: "/assets/generated/perfume-oriental.dim_400x500.jpg",
  };
  return (
    map[category.toLowerCase()] ??
    "/assets/generated/perfume-floral.dim_400x500.jpg"
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({
  cartCount,
  onCartOpen,
}: {
  cartCount: number;
  onCartOpen: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-obsidian/95 backdrop-blur-md border-b border-gold/20 shadow-gold"
          : "bg-transparent"
      }`}
    >
      <div className="section-padding py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.button
          type="button"
          onClick={() => navTo("home")}
          whileHover={{ scale: 1.02 }}
          className="flex items-center"
          data-ocid="nav.home_link"
        >
          <img
            src="/assets/generated/perfume-logo-transparent.dim_300x80.png"
            alt="Lumière"
            className="h-10 w-auto"
          />
        </motion.button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Home", id: "home", ocid: "nav.home_link" },
            {
              label: "Collection",
              id: "collection",
              ocid: "nav.collection_link",
            },
            { label: "About", id: "about", ocid: "nav.about_link" },
            { label: "Contact", id: "contact", ocid: "nav.contact_link" },
          ].map(({ label, id, ocid }) => (
            <button
              type="button"
              key={id}
              onClick={() => navTo(id)}
              data-ocid={ocid}
              className="font-sans text-sm tracking-[0.15em] uppercase text-foreground/70 hover:text-gold transition-colors duration-300 relative group"
            >
              {label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </nav>

        {/* Cart + mobile menu */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCartOpen}
            data-ocid="nav.cart_button"
            className="relative p-2 text-foreground/80 hover:text-gold transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-gold text-obsidian text-[10px] font-bold flex items-center justify-center min-w-[18px] min-h-[18px] px-1"
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground/80 hover:text-gold transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5 w-5">
              <span
                className={`h-px bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`h-px bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`h-px bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-obsidian/98 border-t border-gold/15"
          >
            <div className="section-padding py-6 flex flex-col gap-4">
              {[
                { label: "Home", id: "home", ocid: "nav.home_link" },
                {
                  label: "Collection",
                  id: "collection",
                  ocid: "nav.collection_link",
                },
                { label: "About", id: "about", ocid: "nav.about_link" },
                { label: "Contact", id: "contact", ocid: "nav.contact_link" },
              ].map(({ label, id, ocid }) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => navTo(id)}
                  data-ocid={ocid}
                  className="text-left font-sans text-sm tracking-[0.15em] uppercase text-foreground/70 hover:text-gold transition-colors py-1"
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const scrollToCollection = () => {
    document
      .getElementById("collection")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(/assets/generated/hero-perfume.dim_1200x700.jpg)",
        }}
      />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian/95 via-obsidian/75 to-obsidian/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/60" />

      {/* Subtle animated grain */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] bg-repeat" />

      <div className="relative z-10 section-padding w-full pt-24 pb-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="max-w-2xl"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
            className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-6"
          >
            Maison de Parfum · Paris
          </motion.p>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] font-light text-cream mb-6"
          >
            Where <span className="text-gold-gradient italic">Fragrance</span>
            <br />
            Meets Art
          </motion.h1>

          <motion.div
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              visible: {
                opacity: 1,
                scaleX: 1,
                transition: { duration: 0.6, delay: 0.1 },
              },
            }}
            className="gold-divider w-40 mb-6 origin-left"
          />

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
            }}
            className="font-body-serif text-xl text-foreground/70 leading-relaxed mb-10 max-w-md"
          >
            Rare botanical essences, distilled into compositions that endure.
            Each fragrance is a story told in silence.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
            className="flex items-center gap-6"
          >
            <Button
              onClick={scrollToCollection}
              data-ocid="hero.primary_button"
              className="bg-gold text-obsidian hover:bg-gold-light font-sans text-xs tracking-[0.2em] uppercase px-8 py-6 rounded-none transition-all duration-300 shadow-gold-sm hover:shadow-gold"
            >
              Explore Collection
            </Button>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="font-sans text-xs tracking-[0.2em] uppercase text-foreground/60 hover:text-gold transition-colors flex items-center gap-2"
            >
              Our Story
              <ChevronDown className="w-3 h-3" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-foreground/40">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.8,
            ease: "easeInOut",
          }}
          className="w-px h-8 bg-gradient-to-b from-gold/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({
  perfume,
  index,
  onViewDetails,
}: {
  perfume: Perfume;
  index: number;
  onViewDetails: (p: Perfume) => void;
}) {
  const ocidIndex = (index + 1).toString();

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: (index % 3) * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      data-ocid={`product.item.${ocidIndex}`}
      className="group relative bg-card border border-border hover:border-gold/40 transition-all duration-500 shadow-card overflow-hidden"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/5]">
        <img
          src={getCategoryImage(perfume.category)}
          alt={perfume.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase bg-obsidian/80 backdrop-blur-sm text-gold px-3 py-1 border border-gold/30">
            {perfume.category}
          </span>
        </div>
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-obsidian/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-display text-xl font-light text-cream mb-1 tracking-wide">
          {perfume.name}
        </h3>
        <p className="font-body-serif text-foreground/60 text-sm italic mb-3">
          {perfume.tagline}
        </p>

        {/* Scent notes */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {perfume.scentNotes.slice(0, 3).map((note) => (
            <span
              key={note}
              className="font-sans text-[10px] tracking-widest uppercase text-gold-dim bg-gold/8 border border-gold/20 px-2 py-0.5"
            >
              {note}
            </span>
          ))}
          {perfume.scentNotes.length > 3 && (
            <span className="font-sans text-[10px] tracking-widest uppercase text-muted-foreground px-2 py-0.5">
              +{perfume.scentNotes.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display text-2xl text-gold font-light">
            {formatPrice(perfume.price)}
          </span>
          <Button
            onClick={() => onViewDetails(perfume)}
            data-ocid={`product.view_button.${ocidIndex}`}
            variant="outline"
            className="border-gold/40 text-gold hover:bg-gold hover:text-obsidian rounded-none font-sans text-[10px] tracking-[0.15em] uppercase py-4 px-4 transition-all duration-300"
          >
            View Details
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Collection Section ──────────────────────────────────────────────────────

function CollectionSection({
  onViewDetails,
}: { onViewDetails: (p: Perfume) => void }) {
  const { data: perfumes, isLoading } = useGetAllPerfumes();

  return (
    <section
      id="collection"
      className="py-28 relative"
      data-ocid="collection.section"
    >
      {/* Background texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian-mid/50 to-obsidian" />

      <div className="relative z-10 section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="font-sans text-xs tracking-[0.35em] uppercase text-gold mb-4">
            Our Creations
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-light text-cream mb-6">
            The Collection
          </h2>
          <div className="gold-divider w-24 mx-auto mb-6" />
          <p className="font-body-serif text-lg text-foreground/60 max-w-lg mx-auto italic">
            Twelve compositions born from the world's finest raw materials, each
            a chapter in an unfolding narrative.
          </p>
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => `skel-${i}`).map((key) => (
              <div
                key={key}
                className="bg-card border border-border overflow-hidden"
              >
                <Skeleton className="aspect-[4/5] w-full bg-obsidian-mid/60" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4 bg-obsidian-mid/60" />
                  <Skeleton className="h-4 w-1/2 bg-obsidian-mid/60" />
                  <Skeleton className="h-8 w-full bg-obsidian-mid/60" />
                </div>
              </div>
            ))}
          </div>
        ) : !perfumes || perfumes.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-foreground/40 italic">
              The collection is being curated…
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {perfumes.map((perfume, index) => (
              <ProductCard
                key={perfume.id.toString()}
                perfume={perfume}
                index={index}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Product Detail Modal ─────────────────────────────────────────────────────

function ProductDetailModal({
  perfume,
  open,
  onClose,
}: {
  perfume: Perfume | null;
  open: boolean;
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState("1");
  const addToCart = useAddToCart();

  const handleAddToCart = async () => {
    if (!perfume) return;
    try {
      await addToCart.mutateAsync({
        perfumeId: perfume.id,
        quantity: BigInt(quantity),
      });
      toast.success(`${perfume.name} added to your cart`, {
        description: `${quantity} × ${formatPrice(perfume.price)}`,
      });
      onClose();
    } catch {
      toast.error("Could not add to cart. Please try again.");
    }
  };

  if (!perfume) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="product.dialog"
        className="max-w-2xl bg-card border-border p-0 overflow-hidden rounded-none max-h-[90vh] overflow-y-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative overflow-hidden min-h-64 md:min-h-full">
            <img
              src={getCategoryImage(perfume.category)}
              alt={perfume.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase bg-obsidian/80 text-gold px-3 py-1 border border-gold/30">
                {perfume.category}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              <DialogHeader className="mb-4">
                <DialogTitle className="font-display text-3xl font-light text-cream leading-tight text-left">
                  {perfume.name}
                </DialogTitle>
                <p className="font-body-serif italic text-foreground/60 text-base">
                  {perfume.tagline}
                </p>
              </DialogHeader>

              <div className="gold-divider mb-5" />

              <p className="font-body-serif text-foreground/75 leading-relaxed text-sm mb-6">
                {perfume.description}
              </p>

              {/* Scent notes */}
              <div className="mb-6">
                <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-gold mb-3">
                  Scent Notes
                </p>
                <div className="flex flex-wrap gap-2">
                  {perfume.scentNotes.map((note) => (
                    <span
                      key={note}
                      className="font-sans text-[10px] tracking-widest uppercase text-gold-dim bg-gold/8 border border-gold/25 px-3 py-1"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price */}
              <p className="font-display text-4xl text-gold font-light mb-6">
                {formatPrice(perfume.price)}
              </p>

              {/* Quantity */}
              <div className="mb-6">
                <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-foreground/50 mb-2">
                  Quantity
                </p>
                <Select value={quantity} onValueChange={setQuantity}>
                  <SelectTrigger
                    data-ocid="cart.select"
                    className="w-24 rounded-none border-border bg-obsidian text-cream"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-none">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem
                        key={n}
                        value={n.toString()}
                        className="font-sans text-sm"
                      >
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              data-ocid="product.add_button"
              disabled={addToCart.isPending}
              className="w-full bg-gold text-obsidian hover:bg-gold-light rounded-none font-sans text-xs tracking-[0.2em] uppercase py-6 transition-all duration-300 shadow-gold-sm hover:shadow-gold"
            >
              {addToCart.isPending ? "Adding…" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────

function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: cartItems = [], isLoading } = useGetCart();
  const { data: perfumes = [] } = useGetAllPerfumes();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();
  const placeOrder = usePlaceOrder();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const cartWithDetails = cartItems.map((item: CartItem) => {
    const perfume = perfumes.find((p) => p.id === item.perfumeId);
    return { ...item, perfume };
  });

  const total = cartWithDetails.reduce((sum, item) => {
    if (!item.perfume) return sum;
    return sum + Number(item.perfume.price) * Number(item.quantity);
  }, 0);

  const handlePlaceOrder = async () => {
    try {
      await placeOrder.mutateAsync();
      setOrderPlaced(true);
    } catch {
      toast.error("Could not place order. Please try again.");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart.mutateAsync();
      toast.success("Cart cleared");
    } catch {
      toast.error("Could not clear cart.");
    }
  };

  const handleRemove = async (perfumeId: bigint) => {
    try {
      await removeFromCart.mutateAsync(perfumeId);
    } catch {
      toast.error("Could not remove item.");
    }
  };

  // Reset success state when drawer closes
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setOrderPlaced(false), 400);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        data-ocid="cart.sheet"
        side="right"
        className="w-full sm:w-[420px] bg-card border-l border-border rounded-none p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-5 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-xl font-light text-cream tracking-wide">
              Your Cart
              {cartItems.length > 0 && (
                <span className="font-sans text-xs text-gold ml-2 tracking-[0.15em]">
                  ({cartItems.length})
                </span>
              )}
            </SheetTitle>
          </div>
          <div className="gold-divider mt-3" />
        </SheetHeader>

        {/* Order success state */}
        <AnimatePresence>
          {orderPlaced && (
            <motion.div
              data-ocid="cart.success_state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <CheckCircle className="w-16 h-16 text-gold" />
              </motion.div>
              <div>
                <p className="font-display text-2xl text-cream font-light mb-2">
                  Order Placed
                </p>
                <p className="font-body-serif text-foreground/60 italic text-sm">
                  Thank you. Your fragrance will arrive beautifully wrapped.
                </p>
              </div>
              <Button
                onClick={onClose}
                className="bg-gold text-obsidian hover:bg-gold-light rounded-none font-sans text-xs tracking-[0.2em] uppercase px-8 py-5"
              >
                Continue Shopping
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {!orderPlaced && (
          <>
            {/* Cart items */}
            <ScrollArea className="flex-1 px-6">
              {isLoading ? (
                <div className="py-8 space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 py-4">
                      <Skeleton className="w-16 h-20 bg-obsidian-mid/60 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4 bg-obsidian-mid/60" />
                        <Skeleton className="h-4 w-1/2 bg-obsidian-mid/60" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : cartWithDetails.length === 0 ? (
                <motion.div
                  data-ocid="cart.empty_state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center"
                >
                  <ShoppingBag className="w-10 h-10 text-foreground/20 mx-auto mb-4" />
                  <p className="font-display text-lg text-foreground/40 italic font-light">
                    Your cart is empty
                  </p>
                  <p className="font-body-serif text-sm text-foreground/30 mt-2">
                    Explore the collection to find your signature scent.
                  </p>
                </motion.div>
              ) : (
                <div className="py-4">
                  {cartWithDetails.map((item, idx) => {
                    const ocidIndex = (idx + 1).toString();
                    return (
                      <motion.div
                        key={item.perfumeId.toString()}
                        data-ocid={`cart.item.${ocidIndex}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex gap-4 py-5 border-b border-border/50 last:border-0"
                      >
                        {/* Thumbnail */}
                        {item.perfume && (
                          <img
                            src={getCategoryImage(item.perfume.category)}
                            alt={item.perfume.name}
                            className="w-16 h-20 object-cover shrink-0 border border-border"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-base text-cream font-light truncate">
                            {item.perfume?.name ?? "Unknown"}
                          </p>
                          <p className="font-body-serif text-xs text-foreground/50 italic mt-0.5">
                            Qty: {item.quantity.toString()}
                          </p>
                          {item.perfume && (
                            <p className="font-display text-gold text-base mt-2">
                              {formatPrice(
                                BigInt(
                                  Number(item.perfume.price) *
                                    Number(item.quantity),
                                ),
                              )}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.perfumeId)}
                          data-ocid={`cart.delete_button.${ocidIndex}`}
                          disabled={removeFromCart.isPending}
                          className="text-foreground/30 hover:text-destructive transition-colors p-1 shrink-0 self-start mt-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            {cartWithDetails.length > 0 && (
              <div className="border-t border-border px-6 py-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-foreground/60">
                    Total
                  </span>
                  <span className="font-display text-2xl text-gold font-light">
                    ${(total / 100).toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={handlePlaceOrder}
                  data-ocid="cart.place_order_button"
                  disabled={placeOrder.isPending}
                  className="w-full bg-gold text-obsidian hover:bg-gold-light rounded-none font-sans text-xs tracking-[0.2em] uppercase py-6 transition-all duration-300"
                >
                  {placeOrder.isPending ? "Placing Order…" : "Place Order"}
                </Button>
                <Button
                  onClick={handleClearCart}
                  data-ocid="cart.clear_button"
                  disabled={clearCart.isPending}
                  variant="ghost"
                  className="w-full rounded-none font-sans text-xs tracking-[0.15em] uppercase text-foreground/40 hover:text-destructive hover:bg-transparent py-3"
                >
                  Clear Cart
                </Button>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────

function AboutSection() {
  const pillars = [
    {
      label: "Rare Botanicals",
      desc: "Sourced from the world's most remote gardens and ancient forests.",
    },
    {
      label: "Master Perfumers",
      desc: "Each formula is crafted by artisans with generations of olfactory heritage.",
    },
    {
      label: "Timeless Craft",
      desc: "Cold maceration, enfleurage, and steam distillation. No shortcuts.",
    },
  ];

  return (
    <section id="about" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-[oklch(0.11_0.008_30)] to-obsidian" />

      {/* Decorative element */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,oklch(0.76_0.12_82),transparent_70%)]" />
      </div>

      <div className="relative z-10 section-padding">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="font-sans text-xs tracking-[0.35em] uppercase text-gold mb-4">
              Est. 1987
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-cream mb-6">
              The Art of Perfumery
            </h2>
            <div className="gold-divider w-24 mx-auto" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-body-serif text-xl md:text-2xl text-foreground/75 text-center leading-relaxed mb-20 italic"
          >
            "Crafted from the world's rarest botanicals, our fragrances are an
            ode to the art of perfumery. Each bottle tells a story of passion,
            discovery, and timeless elegance."
          </motion.p>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-10 h-px bg-gold mx-auto mb-5" />
                <h3 className="font-display text-lg text-cream font-light mb-3 tracking-wide">
                  {pillar.label}
                </h3>
                <p className="font-body-serif text-foreground/60 leading-relaxed text-sm">
                  {pillar.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter / Contact Section ─────────────────────────────────────────────

function ContactSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    toast.success("You're on the list", {
      description: "Exclusive previews and rare releases, ahead of the world.",
    });
  };

  return (
    <section id="contact" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-obsidian-mid" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.76_0.12_82/5%),transparent_70%)]" />

      <div className="relative z-10 section-padding">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-gold mb-4">
                Exclusive Access
              </p>
              <h2 className="font-display text-4xl font-light text-cream mb-4">
                Stay in the Know
              </h2>
              <div className="gold-divider w-20 mb-6" />
              <p className="font-body-serif text-foreground/60 mb-8 text-lg leading-relaxed">
                Subscribe for early access to new compositions, private events,
                and the stories behind each fragrance.
              </p>

              <AnimatePresence mode="wait">
                {subscribed ? (
                  <motion.div
                    data-ocid="newsletter.success_state"
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 text-gold"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-body-serif italic">
                      Welcome to the Lumière circle.
                    </span>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubscribe}
                    className="flex gap-0"
                  >
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      data-ocid="newsletter.input"
                      className="rounded-none border-border bg-obsidian text-cream placeholder:text-foreground/30 focus-visible:ring-gold focus-visible:border-gold font-body-serif text-base flex-1"
                      required
                    />
                    <Button
                      type="submit"
                      data-ocid="newsletter.submit_button"
                      className="bg-gold text-obsidian hover:bg-gold-light rounded-none font-sans text-[10px] tracking-[0.2em] uppercase px-6 shrink-0 transition-all duration-300"
                    >
                      Subscribe
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <p className="font-sans text-xs tracking-[0.35em] uppercase text-gold mb-4">
                Visit Us
              </p>
              <h2 className="font-display text-4xl font-light text-cream mb-4">
                Find Lumière
              </h2>
              <div className="gold-divider w-20 mb-8" />

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <MapPin className="w-4 h-4 text-gold mt-1 shrink-0" />
                  <div>
                    <p className="font-sans text-xs tracking-[0.15em] uppercase text-foreground/50 mb-1">
                      Atelier
                    </p>
                    <p className="font-body-serif text-foreground/80">
                      12 Rue du Faubourg Saint-Honoré
                      <br />
                      75008 Paris, France
                    </p>
                  </div>
                </div>
                <Separator className="bg-border" />
                <div className="flex gap-4 items-start">
                  <Phone className="w-4 h-4 text-gold mt-1 shrink-0" />
                  <div>
                    <p className="font-sans text-xs tracking-[0.15em] uppercase text-foreground/50 mb-1">
                      Telephone
                    </p>
                    <p className="font-body-serif text-foreground/80">
                      +33 (0)1 42 68 24 00
                    </p>
                  </div>
                </div>
                <Separator className="bg-border" />
                <div className="flex gap-4 items-start">
                  <Mail className="w-4 h-4 text-gold mt-1 shrink-0" />
                  <div>
                    <p className="font-sans text-xs tracking-[0.15em] uppercase text-foreground/50 mb-1">
                      Email
                    </p>
                    <p className="font-body-serif text-foreground/80">
                      contact@lumiere-paris.com
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const navTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-obsidian border-t border-gold/15 py-12">
      <div className="section-padding">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          {/* Logo */}
          <img
            src="/assets/generated/perfume-logo-transparent.dim_300x80.png"
            alt="Lumière"
            className="h-8 w-auto opacity-80"
          />

          {/* Nav */}
          <nav className="flex items-center gap-6">
            {[
              { label: "Home", id: "home" },
              { label: "Collection", id: "collection" },
              { label: "About", id: "about" },
              { label: "Contact", id: "contact" },
            ].map(({ label, id }) => (
              <button
                type="button"
                key={id}
                onClick={() => navTo(id)}
                className="font-sans text-xs tracking-[0.15em] uppercase text-foreground/50 hover:text-gold transition-colors"
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-4">
            {[
              { Icon: Instagram, label: "Instagram" },
              { Icon: SiX, label: "X (Twitter)" },
              { Icon: SiFacebook, label: "Facebook" },
            ].map(({ Icon, label }) => (
              <motion.button
                type="button"
                key={label}
                whileHover={{ scale: 1.15, color: "oklch(0.76 0.12 82)" }}
                className="text-foreground/40 hover:text-gold transition-colors p-1"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="gold-divider mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-foreground/30">
            © {new Date().getFullYear()} Lumière Paris. All rights reserved.
          </p>
          <p className="font-sans text-[10px] tracking-[0.15em] text-foreground/25">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold/60 transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const { data: cartItems = [] } = useGetCart();

  const handleViewDetails = (perfume: Perfume) => {
    setSelectedPerfume(perfume);
    setProductModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-obsidian text-cream">
      <Toaster
        theme="dark"
        toastOptions={{
          classNames: {
            toast: "bg-card border-gold/20 text-cream font-sans",
            title: "text-cream",
            description: "text-foreground/60",
          },
        }}
      />

      <Navbar
        cartCount={cartItems.length}
        onCartOpen={() => setCartOpen(true)}
      />

      <main>
        <HeroSection />
        <CollectionSection onViewDetails={handleViewDetails} />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />

      <ProductDetailModal
        perfume={selectedPerfume}
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
      />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
