import { Request, Response} from 'express';
import TrackingCorreios from 'tracking-correios'

class TrackerMailController {

    async tracker(req: Request, res: Response) {

        const { trackerNumber } = req.params;

        await TrackingCorreios.track( trackerNumber )
        .then(event => {
            return res.json(event);
        });

    }
}

export default TrackerMailController;