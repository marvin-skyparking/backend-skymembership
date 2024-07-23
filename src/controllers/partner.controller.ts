import { Request, Response } from 'express';
import partnerChannelService from '../services/partnerChannel.service';

export async function createPartner(req: Request, res: Response): Promise<void> {
    try {
      const partnerChannel = await partnerChannelService.create(req.body);
      res.status(201).json(partnerChannel);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  export async function getAllPartner(req: Request, res: Response): Promise<void> {
    try {
      const partnerChannels = await partnerChannelService.getAll();
      res.status(200).json(partnerChannels);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  export async function getByIdPartner(req: Request, res: Response): Promise<void> {
    try {
      const partnerChannel = await partnerChannelService.getById(req.params.id);
      if (partnerChannel) {
        res.status(200).json(partnerChannel);
      } else {
        res.status(404).json({ message: 'PartnerChannel not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  export async function updatePartner(req: Request, res: Response): Promise<void> {
    try {
      const [rowsUpdated, [updatedPartnerChannel]] = await partnerChannelService.update(req.params.id, req.body);
      if (rowsUpdated > 0) {
        res.status(200).json(updatedPartnerChannel);
      } else {
        res.status(404).json({ message: 'PartnerChannel not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  export async function remove(req: Request, res: Response): Promise<void> {
    try {
      const rowsDeleted = await partnerChannelService.delete(req.params.id);
      if (rowsDeleted > 0) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'PartnerChannel not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }