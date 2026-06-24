import express from "express";

import { getproducts } from "../controllers/marketplaceController";
import { getproductsbyid } from "../controllers/marketplaceController";
import { getproductsSearchByName } from "../controllers/marketplaceController";
import { getproductsAad } from "../controllers/marketplaceController";
import { getproductsUpdate } from "../controllers/marketplaceController";

const router = express.Router();

router.get("/products", getproducts);
router.get("/products/:id", getproductsbyid);
router.get("/products/search/:name/", getproductsSearchByName);
router.get("/products/add", getproductsAad);
router.post("/products/update", getproductsUpdate);

export default router();
