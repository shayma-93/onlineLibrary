import libraryCardRepository from "../repositories/libraryCard.repository.js";
import { notFoundError, forbiddenError, unauthorizedError } from "../Errors/appError.js";
import {checkAdminOrLibrarian,checkAdminLibrarianOrOwner } from "../helpers/authHelper.js";
import { capitalizeWords } from "../helpers/stringHelper.js";
  
  class LibraryCardService {
    async createLibraryCard(libraryCardData, user) {
      checkAdminOrLibrarian(user);
      return await libraryCardRepository.create(libraryCardData);
    }
  
    async getAllLibraryCards() {
      return await libraryCardRepository.findAll();
    }
  
    async getLibraryCardById(id, currentUser) {
      const card = await libraryCardRepository.findById(id);
      if (!card) throw notFoundError("Library card not found");
  
      checkAdminLibrarianOrOwner (currentUser, card.user_id);
      return card;
    }
  
    async updateLibraryCard(id, data, currentUser) {
      const card = await libraryCardRepository.findById(id);
      if (!card) throw notFoundError("Library card not found");
  
      checkAdminOrLibrarian(currentUser);
  
      if (data.name) {
        data.name = capitalizeWords(data.name); 
      }
  
      await libraryCardRepository.update(id, data);
      return await libraryCardRepository.findById(id);
    }
  
    async deleteLibraryCard(id, currentUser) {
      const card = await libraryCardRepository.findById(id);
      if (!card) throw notFoundError("Library card not found");
  
      checkAdminLibrarianOrOwner(currentUser, card.user_id);
      return await libraryCardRepository.delete(id);
    }
  }
  

export default new LibraryCardService();
