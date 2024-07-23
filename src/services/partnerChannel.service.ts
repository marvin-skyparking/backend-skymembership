import PartnerChannel, {PartnerChannelAttributes } from '../models/partnerChannel.model';

class PartnerChannelService {
  async create(data: PartnerChannelAttributes): Promise<PartnerChannel> {
    return PartnerChannel.create(data);
  }

  async getAll(): Promise<PartnerChannel[]> {
    return PartnerChannel.findAll();
  }

  async getById(id: string): Promise<PartnerChannel | null> {
    return PartnerChannel.findByPk(id);
  }

  async update(id: string, data: Partial<PartnerChannelAttributes>): Promise<[number, PartnerChannel[]]> {
    return PartnerChannel.update(data, { where: { id }, returning: true });
  }

  async delete(id: string): Promise<number> {
    return PartnerChannel.destroy({ where: { id } });
  }
}

export default new PartnerChannelService();
