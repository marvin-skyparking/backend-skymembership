import { IPaginatePayload } from '../interfaces/pagination.interface';
import { MasterCard } from '../models/master_card_model';
import {
  createMasterCard,
  getAllMasterCardsWithPagination,
  getMasterCardById
} from '../services/master_card.service';
import { Request, Response } from 'express';

/**
 * Create a new MasterCard record.
 * @param data - Data for the new MasterCard
 */
export async function createMasterCardController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { no_card } = req.body;

    // Ensure no_card is a string
    if (typeof no_card !== 'string' || !no_card.trim()) {
      res.status(400).json({
        status: false,
        message: '"no_card" is required and must be a non-empty string.'
      });
      return;
    }

    // Call the service to create a MasterCard
    const newCard = await createMasterCard(no_card);

    res.status(201).json({
      status: true,
      message: 'MasterCard created successfully',
      data: newCard
    });
  } catch (error: any) {
    console.error('Error creating MasterCard:', error.message);
    res.status(500).json({
      status: false,
      message: error.message || 'Failed to create MasterCard'
    });
  }
}

export async function getAllMasterCardsController(
  req: Request,
  res: Response
): Promise<any> {
  try {
    // Extract pagination parameters from query
    const { page = 1, limit = 10, search } = req.query;

    // Ensure `page` and `limit` are numbers and provide defaults
    const pagination: IPaginatePayload = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      search: req.query.search || ''
    };

    const { data, total } = await getAllMasterCardsWithPagination(pagination);

    return res.status(200).json({
      status: true,
      message: 'MasterCards retrieved successfully',
      data,
      page: {
        currentPage: pagination.page,
        totalPages: Math.ceil(total / pagination.limit),
        totalItems: total
      }
    });
  } catch (error: any) {
    console.error('Error in getAllMasterCardsController:', error.message);
    return res.status(500).json({
      status: false,
      message: error.message || 'Failed to fetch MasterCards'
    });
  }
}

export async function getMasterCardByIdController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        status: false,
        message: 'ID parameter is required'
      });
      return;
    }

    const masterCard = await getMasterCardById(id);

    if (!masterCard) {
      res.status(404).json({
        status: false,
        message: `MasterCard with ID ${id} not found`
      });
      return;
    }

    res.status(200).json({
      status: true,
      message: 'MasterCard retrieved successfully',
      data: masterCard
    });
  } catch (error: any) {
    console.error(
      `Error in getMasterCardByIdController for ID ${req.params.id}:`,
      error.message
    );
    res.status(500).json({
      status: false,
      message: error.message || 'Failed to fetch MasterCard'
    });
  }
}
