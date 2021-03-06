/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

    '*': ['flash','getModel','clientPage'],
    '404': 'clientPage',
    'session':{
        'destroy':  ['flash','authentificated','clientPage']
    },
    'user':{
        '*': ['flash','authentificated','selfProfile','clientPage'],
        'new': ['flash','clientPage'],
        'create': ['flash','clientPage'],
        'subscribe': ['flash','clientPage'],
        'index': ['flash','authentificated','clientPage']
    },
    'blog':{
        'index': ['flash','getModel','clientPage'],
        'show': ['flash','getModel','clientPage'],
        'list': ['flash','getModel','clientPage','admin'],
        'edit': ['flash','getModel','clientPage','admin'],
        'destroy': ['flash','getModel','clientPage','admin'],
        'new':  ['flash','getModel','clientPage','admin'],
        'create':  ['flash','getModel','clientPage','admin'],
        'newSticker':  ['flash','getModel','clientPage','admin'],
        'newBanner':  ['flash','getModel','clientPage','admin'],
        'newImage':  ['flash','getModel','clientPage','admin'],
        'deleteSticker':  ['flash','getModel','clientPage','admin'],
        'deleteBanner':  ['flash','getModel','clientPage','admin'],
        'deleteImage':  ['flash','getModel','clientPage','admin']
    },
    'tag':{
        '*': ['flash','getModel','clientPage','admin']
    },
    'leadin':{
        '*': ['flash','getModel','clientPage','admin']
    },
    'comment':{
        '*': ['flash','getModel','clientPage','admin'],
        'create': ['flash','getModel','clientPage']
    },
    'math' : {
        'admin_create' : ['authentificated'],
        'admin_update' : ['authentificated'],
        'admin_data' : ['authentificated'],
        'saveGraph' : ['authentificated']
    }

  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
        // RabbitController: {

                // Apply the `false` policy as the default for all of RabbitController's actions
                // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
                // '*': false,

                // For the action `nurture`, apply the 'isRabbitMother' policy
                // (this overrides `false` above)
                // nurture	: 'isRabbitMother',

                // Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
                // before letting any users feed our rabbits
                // feed : ['isNiceToAnimals', 'hasRabbitFood']
        // }
};
