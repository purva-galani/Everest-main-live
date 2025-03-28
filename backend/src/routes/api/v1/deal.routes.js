const express = require("express");
const DealController = require("../../../controller/deal.controller");
const router = express.Router();

router.post("/createDeal", DealController.createDeal);         
router.get("/getAllDeals", DealController.getAllDeals);        
router.get("/getLead/:id", DealController.getLeadById);         
router.put("/updateDeal/:id", DealController.updateDeal);    
router.delete("/deleteDeal/:id", DealController.deleteDeal);   
router.get('/searchByMonth', DealController.searchByMonth);
router.get('/searchByYear', DealController.searchByYear);
router.get('/searchByDate', DealController.searchByDate);
router.get('/new', DealController.getNewLeads);
router.get('/discussion',DealController.getDiscussionLeads);
router.get('/demo', DealController.getDemoLeads);
router.get('/proposal', DealController.getProposalLeads);
router.get('/decided', DealController.getDecidedLeads);
router.post('/updateDealStatus',DealController.updateStatus);
router.get('/getDealsByStatus', DealController.getDealsByStatus);

module.exports = router;
