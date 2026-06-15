module.exports = {
    createResponsibility: async (req, res) => {    
        try {
          const newResponsibility = await Responsibility.create(req.body);
          res.status(201).json({ success: true, data: newResponsibility });
        } catch (error) {
          res.status(400).json({ success: false, error: error.message });
        }
      },    
        allResponsibilities: async (req, res) => {  
        try {
            const responsibilities = await Responsibility.find();
            res.status(200).json({ success: true, data: responsibilities });
            } catch (error) {
            res.status(400).json({ success: false, error: error.message });
            }
        },
        getResponsibilityById: async (req, res) => {
        try {
            const responsibility = await Responsibility.findById(req.params.id);
            if (!responsibility) {
                return res.status(404).json({ success: false, message: "Responsibility not found" });
            }
            res.status(200).json({ success: true, data: responsibility });
            } catch (error) {
            res.status(400).json({ success: false, error: error.message });
            }
        },
        updateResponsibility: async (req, res) => {
        try {
            const updatedResponsibility = await Responsibility.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedResponsibility) {
                return res.status(404).json({ success: false, message: "Responsibility not found" });
            }
            res.status(200).json({ success: true, data: updatedResponsibility });
            } catch (error) {
            res.status(400).json({ success: false, error: error.message });
            }
        },
        deleteResponsibility: async (req, res) => {
        try {
            const deletedResponsibility = await Responsibility.findByIdAndDelete(req.params.id);
            if (!deletedResponsibility) {
                return res.status(404).json({ success: false, message: "Responsibility not found" });
            }
            res.status(200).json({ success: true, message: "Responsibility deleted successfully" });
            } catch (error) {
            res.status(400).json({ success: false, error: error.message });
            }
        },
        getAllResponsibilities: async (req, res) => {
            try {
                const responsibilities = await Responsibility.find();
                res.status(200).json({ success: true, data: responsibilities });
            } catch (error) {
                res.status(400).json({ success: false, error: error.message });
            }
        },  

}