import { domMax } from "framer-motion";

// Keep the animation feature package out of the initial route bundle.
//
// This must stay domMax, NOT domAnimation. domAnimation is roughly half the
// JavaScript, but it ships neither layout projection nor drag, and the shop
// grids still depend on layout projection:
//
//   components/shop/ShopContent.tsx        — <motion.div layout> (x2)
//   components/plp/LuxuryProductGrid.tsx   — <motion.div layout> (x2)
//
// Those are what make surviving cards glide to their new positions when you
// filter, sort, or switch grid/list, and they pair with
// <AnimatePresence mode="popLayout">, which only reflows siblings if
// projection is available. Downgrading makes all four silently do nothing —
// no error, the cards just snap.
//
// Note that a bare `layout` prop needs this feature just as much as `layoutId`
// does, so grepping only for `layoutId` will give you a false all-clear.
// Remove those four props first if you want the smaller bundle.
export default domMax;
